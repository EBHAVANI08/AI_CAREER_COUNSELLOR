import { NextRequest, NextResponse } from 'next/server';
import { agenticChat, buildProfileContext } from '@/lib/ai/brain';
import type { UserProfile, ChatMessage } from '@/types';
import { db } from '@/lib/db';
import { requireSession } from '@/lib/security/session';

const MONTHLY_AI_LIMITS = { FREE: 100, PRO: 2_000, TEAM: 10_000, ENTERPRISE: 100_000 } as const;

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const membership = session.user.memberships[0];
    if (!membership) return NextResponse.json({ error: 'No organization access' }, { status: 403 });

    const body = await request.json();
    const { message, history, profile, threadId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const periodStart = new Date();
    periodStart.setUTCDate(1);
    periodStart.setUTCHours(0, 0, 0, 0);
    const used = await db.usageEvent.aggregate({
      where: { organizationId: membership.organizationId, feature: 'ai.chat', createdAt: { gte: periodStart } },
      _sum: { quantity: true },
    });
    const limit = MONTHLY_AI_LIMITS[membership.organization.plan];
    if ((used._sum.quantity || 0) >= limit) {
      return NextResponse.json({ error: 'Monthly AI quota reached', code: 'QUOTA_EXCEEDED', limit }, { status: 402 });
    }

    // Build user profile from request
    const userProfile: UserProfile = {
      name: profile?.name || 'Student',
      email: profile?.email || '',
      userType: profile?.userType || null,
      onboardingComplete: profile?.onboardingComplete || false,
      country: profile?.country || '',
      countryName: profile?.countryName || '',
      riasecResult: profile?.riasecResult || null,
      mbtiResult: profile?.mbtiResult || null,
      careerQuizResult: profile?.careerQuizResult || null,
      skills: profile?.skills || [],
      interests: profile?.interests || [],
      education: profile?.education || '',
      targetRole: profile?.targetRole || '',
    };

    const chatHistory: ChatMessage[] = Array.isArray(history) ? history : [];

    const result = await agenticChat(message, userProfile, chatHistory);

    let activeThreadId = typeof threadId === 'string' ? threadId : undefined;
    if (activeThreadId) {
      const ownedThread = await db.chatThread.findFirst({ where: { id: activeThreadId, userId: session.userId, organizationId: membership.organizationId }, select: { id: true } });
      if (!ownedThread) activeThreadId = undefined;
    }
    if (!activeThreadId) {
      const thread = await db.chatThread.create({
        data: { userId: session.userId, organizationId: membership.organizationId, title: message.slice(0, 80) },
      });
      activeThreadId = thread.id;
    }
    await db.$transaction([
      db.chatMessage.create({ data: { threadId: activeThreadId, role: 'user', content: message } }),
      db.chatMessage.create({ data: { threadId: activeThreadId, role: 'assistant', content: result.content, provider: 'zai-groq-fallback' } }),
      db.usageEvent.create({ data: { userId: session.userId, organizationId: membership.organizationId, feature: 'ai.chat', quantity: 1, metadata: { agent: result.agentUsed } } }),
    ]);

    return NextResponse.json({
      message: result.content,
      suggestedActions: result.suggestedActions,
      confidence: result.confidence,
      agentUsed: result.agentUsed,
      threadId: activeThreadId,
      usage: { used: (used._sum.quantity || 0) + 1, limit },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
