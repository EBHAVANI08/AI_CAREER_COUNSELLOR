import { NextRequest, NextResponse } from 'next/server';
import { AssessmentType, Prisma } from '@prisma/client';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireSession, requestMetadata } from '@/lib/security/session';

const assessmentType = z.enum(['RIASEC', 'MBTI', 'CAREER_QUIZ']);
const createSchema = z.object({
  type: assessmentType,
  result: z.record(z.string(), z.unknown()),
  questionOrder: z.array(z.number().int().positive()).max(100).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    const membership = session.user.memberships[0];
    if (!membership) return NextResponse.json({ error: 'No organization access' }, { status: 403 });

    const parsedType = assessmentType.safeParse(request.nextUrl.searchParams.get('type'));
    const attempts = await db.assessmentAttempt.findMany({
      where: {
        userId: session.userId,
        organizationId: membership.organizationId,
        ...(parsedType.success ? { type: parsedType.data as AssessmentType } : {}),
      },
      orderBy: { completedAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ attempts });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Unable to load attempts' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const membership = session.user.memberships[0];
    if (!membership) return NextResponse.json({ error: 'No organization access' }, { status: 403 });

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid assessment result' }, { status: 400 });
    const metadata = await requestMetadata();

    const attempt = await db.assessmentAttempt.create({
      data: {
        userId: session.userId,
        organizationId: membership.organizationId,
        type: parsed.data.type as AssessmentType,
        result: parsed.data.result as Prisma.InputJsonValue,
        questionOrder: parsed.data.questionOrder,
      },
    });
    await db.auditLog.create({
      data: {
        actorId: session.userId,
        organizationId: membership.organizationId,
        action: 'assessment.completed',
        entityType: 'AssessmentAttempt',
        entityId: attempt.id,
        metadata: { type: parsed.data.type },
        ...metadata,
      },
    });
    return NextResponse.json({ attempt }, { status: 201 });
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === 'UNAUTHORIZED';
    return NextResponse.json({ error: unauthorized ? 'Unauthorized' : 'Unable to save assessment' }, { status: unauthorized ? 401 : 500 });
  }
}
