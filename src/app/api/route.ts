import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ name: 'CareerAI Enterprise API', version: '1.0.0', status: 'operational', health: '/api/health' });
}
