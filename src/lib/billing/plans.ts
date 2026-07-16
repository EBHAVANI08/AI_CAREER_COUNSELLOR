import type { PlanCode } from '@prisma/client';

export const SAAS_PLANS = {
  FREE: { name: 'Free', monthlyPriceInr: 0, aiChats: 100, members: 1 },
  PRO: { name: 'Pro', monthlyPriceInr: 499, aiChats: 2_000, members: 1 },
  TEAM: { name: 'Team', monthlyPriceInr: 1_999, aiChats: 10_000, members: 10 },
  ENTERPRISE: { name: 'Enterprise', monthlyPriceInr: null, aiChats: 100_000, members: null },
} satisfies Record<PlanCode, { name: string; monthlyPriceInr: number | null; aiChats: number; members: number | null }>;

export function razorpayPlanId(plan: Exclude<PlanCode, 'FREE' | 'ENTERPRISE'>) {
  return plan === 'PRO' ? process.env.RAZORPAY_PRO_PLAN_ID : process.env.RAZORPAY_TEAM_PLAN_ID;
}
