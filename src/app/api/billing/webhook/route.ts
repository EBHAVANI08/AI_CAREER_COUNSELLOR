import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { PlanCode, SubscriptionStatus } from '@prisma/client';
import { db } from '@/lib/db';

type WebhookPayload = {
  event: string;
  payload?: { subscription?: { entity?: { id?: string; status?: string; current_start?: number; current_end?: number; notes?: { organizationId?: string; plan?: PlanCode } } } };
};

const STATUS_MAP: Record<string, SubscriptionStatus> = {
  created: 'TRIALING', authenticated: 'TRIALING', active: 'ACTIVE', pending: 'PAST_DUE', halted: 'PAST_DUE', cancelled: 'CANCELLED', completed: 'EXPIRED', expired: 'EXPIRED',
};

export async function POST(request: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Webhook is not configured' }, { status: 503 });

  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  const valid = signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const payload = JSON.parse(rawBody) as WebhookPayload;
  const entity = payload.payload?.subscription?.entity;
  if (!entity?.id) return NextResponse.json({ received: true });

  const status = STATUS_MAP[entity.status || ''] || 'PAST_DUE';
  const subscription = await db.subscription.update({
    where: { providerSubscriptionId: entity.id },
    data: {
      status,
      currentPeriodStart: entity.current_start ? new Date(entity.current_start * 1000) : undefined,
      currentPeriodEnd: entity.current_end ? new Date(entity.current_end * 1000) : undefined,
    },
  });
  if (status === 'ACTIVE') {
    await db.organization.update({ where: { id: subscription.organizationId }, data: { plan: subscription.plan } });
  } else if (['CANCELLED', 'EXPIRED'].includes(status)) {
    await db.organization.update({ where: { id: subscription.organizationId }, data: { plan: 'FREE' } });
  }
  await db.auditLog.create({
    data: { organizationId: subscription.organizationId, action: `billing.${payload.event}`, entityType: 'Subscription', entityId: subscription.id, metadata: { providerSubscriptionId: entity.id, status } },
  });
  return NextResponse.json({ received: true });
}
