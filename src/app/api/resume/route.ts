import { NextRequest, NextResponse } from 'next/server';
import { generateAIResume } from '@/lib/ai/brain';
import type { UserProfile } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, profile } = body;

    if (!data) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
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

    const content = await generateAIResume(
      {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        summary: data.summary || '',
        education: data.education || '',
        skills: data.skills || '',
        experience: data.experience || '',
        projects: data.projects || '',
        achievements: data.achievements || '',
      },
      userProfile
    );

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Resume API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}
