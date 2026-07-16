import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { razorpayPlanId } from '@/lib/billing/plans';
import { razorpayRequest } from '@/lib/billing/razorpay';
import { requireSession } from '@/lib/security/session';

const schema = z.object({ plan: z.enum(['PRO', 'TEAM']) });
type RazorpaySubscription = { id: string; status: string; current_start?: number; current_end?: number };

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    const membership = session.user.memberships[0];
    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
      return NextResponse.json({ error: 'Billing administrator access required' }, { status: 403 });
    }
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const planId = razorpayPlanId(parsed.data.plan);
    if (!planId) return NextResponse.json({ error: 'This billing plan is not configured' }, { status: 503 });

    const subscription = await razorpayRequest<RazorpaySubscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        plan_id: planId,
        total_count: 120,
        quantity: 1,
        customer_notify: 1,
        notes: { organizationId: membership.organizationId, userId: session.userId, plan: parsed.data.plan },
      }),
    });

    await db.subscription.upsert({
      where: { organizationId: membership.organizationId },
      update: { plan: parsed.data.plan, status: 'TRIALING', providerSubscriptionId: subscription.id },
      create: { organizationId: membership.organizationId, plan: parsed.data.plan, status: 'TRIALING', providerSubscriptionId: subscription.id },
    });

    return NextResponse.json({ keyId: process.env.RAZORPAY_KEY_ID, subscriptionId: subscription.id, plan: parsed.data.plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message === 'UNAUTHORIZED' ? 401 : message === 'BILLING_NOT_CONFIGURED' ? 503 : 500;
    return NextResponse.json({ error: status === 503 ? 'Billing is not configured' : 'Unable to create subscription' }, { status });
  }
}
