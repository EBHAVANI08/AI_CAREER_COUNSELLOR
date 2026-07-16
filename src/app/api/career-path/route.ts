import { NextRequest, NextResponse } from 'next/server';
import { generateCareerPath } from '@/lib/ai/brain';
import type { UserProfile } from '@/types';
import { requireSession } from '@/lib/security/session';

export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const body = await request.json();
    const { targetRole, profile } = body;

    if (!targetRole || typeof targetRole !== 'string') {
      return NextResponse.json({ error: 'Target role is required' }, { status: 400 });
    }

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

    const steps = await generateCareerPath(targetRole, userProfile);

    return NextResponse.json({ steps });
  } catch (error) {
    console.error('Career Path API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate career path' },
      { status: 500 }
    );
  }
}
