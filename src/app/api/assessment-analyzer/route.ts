import { NextResponse } from 'next/server';
import { analyzeAssessmentResults } from '@/lib/ai/brain';
import type { UserProfile } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile } = body;

    const userProfile: UserProfile = {
      name: profile?.name || 'Student',
      email: profile?.email || '',
      userType: profile?.userType || null,
      onboardingComplete: profile?.onboardingComplete || false,
      country: profile?.country || '',
      countryName: profile?.countryName || '',
      riasecResult: profile?.riasecResult || null,
      mbtiResult: profile?.mbtiResult || null,
      careerQuizResult: profile?.careerQuizResult || null,
      skills: profile?.skills || [],
      interests: profile?.interests || [],
      education: profile?.education || '',
      targetRole: profile?.targetRole || '',
    };

    const analysis = await analyzeAssessmentResults(userProfile);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Assessment Analyzer API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze assessments' },
      { status: 500 }
    );
  }
}
