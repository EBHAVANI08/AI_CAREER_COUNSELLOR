import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { requireSession, requestMetadata } from '@/lib/security/session';

export async function GET() {
  try {
    const session = await requireSession();
    const membership = session.user.memberships[0];
    if (!membership) return NextResponse.json({ error: 'No organization access' }, { status: 403 });
    const organization = await db.organization.findUnique({ where: { id: membership.organizationId }, include: { subscription: true, memberships: { select: { id: true, role: true, createdAt: true, user: { select: { id: true, name: true, email: true, status: true } } } } } });
    return NextResponse.json({ organization, currentRole: membership.role });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession();
    const membership = session.user.memberships[0];
    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) return NextResponse.json({ error: 'Administrator access required' }, { status: 403 });
    const parsed = z.object({ name: z.string().trim().min(2).max(100) }).safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid organization name' }, { status: 400 });
    const organization = await db.organization.update({ where: { id: membership.organizationId }, data: { name: parsed.data.name } });
    const metadata = await requestMetadata();
    await db.auditLog.create({ data: { actorId: session.userId, organizationId: membership.organizationId, action: 'organization.updated', entityType: 'Organization', entityId: organization.id, ...metadata } });
    return NextResponse.json({ organization });
  } catch (error) {
    const unauthorized = error instanceof Error && error.message === 'UNAUTHORIZED';
    return NextResponse.json({ error: unauthorized ? 'Unauthorized' : 'Unable to update organization' }, { status: unauthorized ? 401 : 500 });
  }
}
