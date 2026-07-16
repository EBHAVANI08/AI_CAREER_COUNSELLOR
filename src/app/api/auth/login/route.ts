import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/security/password';
import { createSession, requestMetadata } from '@/lib/security/session';
import { rateLimit } from '@/lib/security/rate-limit';

const schema = z.object({
  email: z.string().trim().email().transform(value => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  const metadata = await requestMetadata();

  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });

    const limiter = rateLimit(`login:${metadata.ipAddress || 'unknown'}:${parsed.data.email}`, 10, 15 * 60 * 1000);
    if (!limiter.allowed) return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });

    const user = await db.user.findUnique({
      where: { email: parsed.data.email },
      include: { profile: true, memberships: { include: { organization: true } } },
    });

    if (!user || user.status !== 'ACTIVE' || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await createSession(user.id);
    const membership = user.memberships[0];
    if (!membership) return NextResponse.json({ error: 'Account has no organization access' }, { status: 403 });

    await db.auditLog.create({
      data: { actorId: user.id, organizationId: membership.organizationId, action: 'auth.login', entityType: 'User', entityId: user.id, ...metadata },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, platformRole: user.platformRole },
      organization: { id: membership.organization.id, name: membership.organization.name, slug: membership.organization.slug, role: membership.role, plan: membership.organization.plan },
      profile: user.profile,
    });
  } catch (error) {
    console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Unable to sign in' }, { status: 500 });
  }
}
