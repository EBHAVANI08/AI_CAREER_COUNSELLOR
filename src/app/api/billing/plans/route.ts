import { NextResponse } from 'next/server';
import { SAAS_PLANS } from '@/lib/billing/plans';

export async function GET() {
  return NextResponse.json({ plans: SAAS_PLANS });
}
