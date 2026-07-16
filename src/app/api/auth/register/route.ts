import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/security/password';
import { createSession, requestMetadata } from '@/lib/security/session';
import { rateLimit } from '@/lib/security/rate-limit';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(8).max(128)
    .regex(/[a-z]/, 'Password requires a lowercase letter')
    .regex(/[A-Z]/, 'Password requires an uppercase letter')
    .regex(/[0-9]/, 'Password requires a number'),
  organizationName: z.string().trim().min(2).max(100).optional(),
});

export async function POST(request: NextRequest) {
  const metadata = await requestMetadata();
  const limiter = rateLimit(`register:${metadata.ipAddress || 'unknown'}`, 5, 15 * 60 * 1000);
  if (!limiter.allowed) {
    return NextResponse.json({ error: 'Too many registration attempts. Try again later.' }, { status: 429 });
  }

  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid registration data' }, { status: 400 });
    }

    const { name, email, password, organizationName } = parsed.data;
    if (await db.user.findUnique({ where: { email }, select: { id: true } })) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const baseSlug = (organizationName || `${name}'s Workspace`)
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'workspace';
    const slug = `${baseSlug}-${randomSuffix()}`;

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        profile: { create: { skills: [], interests: [] } },
        memberships: {
          create: {
            role: 'OWNER',
            organization: { create: { name: organizationName || `${name}'s Workspace`, slug } },
          },
        },
      },
      include: { memberships: { include: { organization: true } }, profile: true },
    });

    const membership = user.memberships[0];
    await db.auditLog.create({
      data: {
        actorId: user.id,
        organizationId: membership.organizationId,
        action: 'auth.register',
        entityType: 'User',
        entityId: user.id,
        ...metadata,
      },
    });
    await createSession(user.id);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, platformRole: user.platformRole },
      organization: { id: membership.organization.id, name: membership.organization.name, slug: membership.organization.slug, role: membership.role, plan: membership.organization.plan },
      profile: user.profile,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Unable to create account' }, { status: 500 });
  }
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8);
}
