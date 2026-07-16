'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import dynamic from 'next/dynamic';

// Dynamic imports for code splitting
const LandingPage = dynamic(() => import('@/components/sections/LandingPage'), { ssr: false });
const OnboardingPage = dynamic(() => import('@/components/sections/OnboardingPage'), { ssr: false });
const Dashboard = dynamic(() => import('@/components/sections/Dashboard'), { ssr: false });
const AssessmentsSection = dynamic(() => import('@/components/sections/AssessmentsSection'), { ssr: false });
const RIASECAssessment = dynamic(() => import('@/components/sections/RIASECAssessment'), { ssr: false });
const MBTIAssessment = dynamic(() => import('@/components/sections/MBTIAssessment'), { ssr: false });
const CareerQuiz = dynamic(() => import('@/components/sections/CareerQuiz'), { ssr: false });
const ChatCoach = dynamic(() => import('@/components/sections/ChatCoach'), { ssr: false });
const CareerPathPage = dynamic(() => import('@/components/sections/CareerPathPage'), { ssr: false });
const ResumeBuilder = dynamic(() => import('@/components/sections/ResumeBuilder'), { ssr: false });
const DiscoverSection = dynamic(() => import('@/components/sections/DiscoverSection'), { ssr: false });
const ProfileSection = dynamic(() => import('@/components/sections/ProfileSection'), { ssr: false });
const Sidebar = dynamic(() => import('@/components/layout/Sidebar'), { ssr: false });
const MobileNav = dynamic(() => import('@/components/layout/MobileNav'), { ssr: false });

function SectionRenderer() {
  const { currentSection, isAuthenticated, onboardingComplete } = useStore();

  // Not authenticated → Landing
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Authenticated but not onboarded
  if (!onboardingComplete) {
    return <OnboardingPage />;
  }

  // Main app sections
  switch (currentSection) {
    case 'dashboard':
      return <Dashboard />;
    case 'assessments':
      return <AssessmentsSection />;
    case 'riasec':
      return <RIASECAssessment />;
    case 'mbti':
      return <MBTIAssessment />;
    case 'career-quiz':
      return <CareerQuiz />;
    case 'chat':
      return <ChatCoach />;
    case 'career-path':
      return <CareerPathPage />;
    case 'resume':
      return <ResumeBuilder />;
    case 'discover':
      return <DiscoverSection />;
    case 'profile':
      return <ProfileSection />;
    default:
      return <Dashboard />;
  }
}

export default function Home() {
  const { isAuthenticated, onboardingComplete, logout, _hydrated, _setHydrated } = useStore();

  useEffect(() => {
    if (!_hydrated) {
      _setHydrated();
    }
  }, [_hydrated, _setHydrated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void fetch('/api/auth/me').then(response => {
      if (response.status === 401) logout();
    }).catch(() => undefined);
  }, [isAuthenticated, logout]);

  // Show loading while hydrating
  if (!_hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0c0c1d] animate-pulse">
            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <p className="text-sm text-[#a3a3a3]">Loading...</p>
        </div>
      </div>
    );
  }

  // Landing / Onboarding — full screen
  if (!isAuthenticated || !onboardingComplete) {
    return <SectionRenderer />;
  }

  // Authenticated app — with sidebar
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <MobileNav />
      <main className="lg:pl-60">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
          <SectionRenderer />
        </div>
      </main>
    </div>
  );
}
