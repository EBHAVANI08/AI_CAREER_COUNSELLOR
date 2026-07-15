import { NextResponse } from 'next/server';
import { careerFields, inDemandSkills, topInstitutions, entranceExams, learningPlatforms } from '@/lib/ai/knowledge';

export async function GET() {
  try {
    return NextResponse.json({
      careerFields,
      inDemandSkills,
      topInstitutions,
      entranceExams,
      learningPlatforms,
    });
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career insights' },
      { status: 500 }
    );
  }
}
