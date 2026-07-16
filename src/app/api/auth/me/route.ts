import { NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/security/session';

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });

  const membership = session.user.memberships[0];
  return NextResponse.json({
    authenticated: true,
    user: { id: session.user.id, email: session.user.email, name: session.user.name, platformRole: session.user.platformRole },
    organization: membership ? { id: membership.organization.id, name: membership.organization.name, slug: membership.organization.slug, role: membership.role, plan: membership.organization.plan } : null,
    profile: session.user.profile,
  });
}
