import { NextRequest, NextResponse } from 'next/server';
import { internshipDatabase, getInternshipsForCountry } from '@/lib/ai/knowledge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { country, field } = body;

    let internships = country ? getInternshipsForCountry(country) : internshipDatabase;

    if (field) {
      internships = internships.filter(i => i.field === field);
    }

    return NextResponse.json({ internships });
  } catch (error) {
    console.error('Internships API error:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}
