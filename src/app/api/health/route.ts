import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const startedAt = Date.now();
  try {
    await db.$runCommandRaw({ ping: 1 });
    return NextResponse.json({ status: 'healthy', database: 'connected', uptimeSeconds: Math.round(process.uptime()), latencyMs: Date.now() - startedAt, timestamp: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ status: 'unhealthy', database: 'disconnected', timestamp: new Date().toISOString() }, { status: 503 });
  }
}
