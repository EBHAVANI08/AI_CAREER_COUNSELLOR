import { NextRequest, NextResponse } from 'next/server';
import { agenticChat, buildProfileContext } from '@/lib/ai/brain';
import type { UserProfile, ChatMessage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, profile } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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

    return NextResponse.json({
      message: result.content,
      suggestedActions: result.suggestedActions,
      confidence: result.confidence,
      agentUsed: result.agentUsed,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
