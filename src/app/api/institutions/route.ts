import { NextRequest, NextResponse } from 'next/server';
import { institutionDatabase, getInstitutionsForCourse } from '@/lib/ai/knowledge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, country } = body;

    if (courseId) {
      const institutions = getInstitutionsForCourse(courseId, country || undefined);
      return NextResponse.json({ institutions });
    }

    // Return all institutions filtered by country
    const institutions = country
      ? institutionDatabase.filter(i => i.location.country === country)
      : institutionDatabase;

    return NextResponse.json({ institutions });
  } catch (error) {
    console.error('Institutions API error:', error);
    return NextResponse.json({ error: 'Failed to fetch institutions' }, { status: 500 });
  }
}
