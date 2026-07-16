import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireSession, requestMetadata } from '@/lib/security/session';

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  userType: z.enum(['school', 'college']).nullable().optional(),
  onboardingComplete: z.boolean().optional(),
  country: z.string().trim().max(10).optional(),
  countryName: z.string().trim().max(100).optional(),
  education: z.string().trim().max(500).optional(),
  targetRole: z.string().trim().max(200).optional(),
  skills: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
  interests: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
  phone: z.string().trim().max(30).optional(),
});

export async function GET() {
  try {
    const session = await requireSession();
    return NextResponse.json({ profile: session.user.profile });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession();
    const membership = session.user.memberships[0];
    const parsed = profileSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid profile' }, { status: 400 });

    const { name, ...profileData } = parsed.data;
    if (name) await db.user.update({ where: { id: session.userId }, data: { name } });
    const profile = await db.userProfile.upsert({
      where: { userId: session.userId },
      update: profileData,
      create: { userId: session.userId, skills: [], interests: [], ...profileData },
    });
    const metadata = await requestMetadata();
    await db.auditLog.create({
      data: { actorId: session.userId, organizationId: membership?.organizationId, action: 'profile.updated', entityType: 'UserProfile', entityId: profile.id, ...metadata },
    });
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === 'UNAUTHORIZED';
    return NextResponse.json({ error: unauthorized ? 'Unauthorized' : 'Unable to update profile' }, { status: unauthorized ? 401 : 500 });
  }
}

export const POST = PATCH;
