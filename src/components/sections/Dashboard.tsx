'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import type { AIRoutingResult } from '@/types';
import {
  Brain, Target, BarChart3, MessageSquare, Map, FileText,
  TrendingUp, CheckCircle2, Circle, Loader2, Sparkles,
  ArrowRight, Zap, Compass, ClipboardList,
} from 'lucide-react';

export default function Dashboard() {
  const store = useStore();
  const [aiRouting, setAiRouting] = useState<AIRoutingResult | null>(store.aiRouting);
  const [routingLoading, setRoutingLoading] = useState(false);

  const profileCompleteness = store.profileCompleteness();
  const completedAssessments = store.completedAssessmentCount();

  async function fetchAIRouting() {
    setRoutingLoading(true);
    try {
      const profile = {
        name: store.user?.name,
        email: store.user?.email,
        userType: store.userType,
        onboardingComplete: store.onboardingComplete,
        country: store.country,
        countryName: store.countryName,
        riasecResult: store.riasecResult,
        mbtiResult: store.mbtiResult,
        careerQuizResult: store.careerQuizResult,
        skills: store.skills,
        interests: store.interests,
        education: store.education,
        targetRole: store.targetRole,
      };
      const res = await fetch('/api/ai-router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setAiRouting(data);
      store.setAIRouting(data);
    } catch (err) {
      console.error('Failed to fetch AI routing:', err);
    } finally {
      setRoutingLoading(false);
    }
  }

  useEffect(() => {
    if (store.aiRouting) return;
    const timer = window.setTimeout(() => void fetchAIRouting(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const assessments = [
    { id: 'riasec', name: 'RIASEC Assessment', desc: 'Career personality type', icon: Target, completed: !!store.riasecResult },
    { id: 'mbti', name: 'MBTI Assessment', desc: 'Work personality style', icon: Brain, completed: !!store.mbtiResult },
    { id: 'quiz', name: 'Career Quiz', desc: 'Ideal career field', icon: BarChart3, completed: !!store.careerQuizResult },
  ];

  const quickActions = [
    { label: 'AI Coach', desc: 'Get personalized guidance', icon: MessageSquare, section: 'chat' as const, color: 'bg-[#f5f5f5] text-[#0c0c1d]' },
    { label: 'Career Roadmap', desc: 'Generate your career path', icon: Map, section: 'career-path' as const, color: 'bg-[#f5f0e6] text-[#b8965a]' },
    { label: 'Discover', desc: 'Courses & internships', icon: Compass, section: 'discover' as const, color: 'bg-[#f5f5f5] text-[#4a4a4a]' },
    { label: 'Build Resume', desc: 'ATS-optimized resume', icon: FileText, section: 'resume' as const, color: 'bg-[#f5f5f5] text-[#0c0c1d]' },
  ];

  const gettingStarted = [
    { text: 'Complete your profile', done: profileCompleteness >= 30 },
    { text: 'Take RIASEC assessment', done: !!store.riasecResult },
    { text: 'Take MBTI assessment', done: !!store.mbtiResult },
    { text: 'Take Career Quiz', done: !!store.careerQuizResult },
    { text: 'Chat with AI Career Coach', done: store.chatMessages.length > 0 },
  ];

  const circumference = 2 * Math.PI * 40;
  const progressOffset = circumference - (profileCompleteness / 100) * circumference;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDateStr = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
            {getGreeting()}, {store.user?.name || 'Student'}
          </h1>
          <p className="text-sm text-[#737373] mt-1">
            {getDateStr()}
            {store.countryName && <span> &middot; {store.countryName}</span>}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#f5f0e6] px-3 py-1.5 text-xs font-semibold text-[#b8965a]">
          <Sparkles className="h-3 w-3" /> CareerAI
        </span>
      </div>

      {/* AI Smart Recommendation */}
      <div className="ai-card">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0c0c1d] text-white">
            <Zap className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
              AI Smart Recommendation
              {routingLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#737373]" />}
            </h3>
            {aiRouting ? (
              <div className="mt-2 space-y-2.5">
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{aiRouting.reasoning}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0c0c1d] px-3 py-1 text-xs font-medium text-white">
                    {aiRouting.primaryPath}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f5] px-3 py-1 text-xs font-medium text-[#0a0a0a] border border-[#ebebeb]">
                    {aiRouting.secondaryPath}
                  </span>
                </div>
                {aiRouting.recommendedActions?.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {aiRouting.recommendedActions.slice(0, 3).map((action) => (
                      <button
                        key={action.id}
                        onClick={() => store.navigateTo(action.section as any)}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#0c0c1d] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1a1a2e] transition-colors"
                      >
                        {action.label} <ArrowRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : !routingLoading ? (
              <p className="text-sm text-[#737373] mt-1">Complete assessments for personalized recommendations</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Profile Strength + Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Strength */}
        <div className="card flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-4">Profile Strength</h3>
          <div className="relative h-24 w-24">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#0c0c1d" strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#0a0a0a]">{profileCompleteness}%</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#737373] text-center">
            {profileCompleteness < 40 ? 'Add more details to strengthen your profile' :
             profileCompleteness < 70 ? 'Good progress. Keep going.' :
             profileCompleteness < 100 ? 'Almost there. Complete remaining items.' : 'Profile complete.'}
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
              Assessments ({completedAssessments}/3)
            </h3>
            <button
              onClick={() => store.navigateTo('assessments')}
              className="text-xs text-[#0c0c1d] hover:text-[#1a1a2e] font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {assessments.map((assessment) => (
            <button
              key={assessment.id}
              onClick={() => store.navigateTo('assessments')}
              className="w-full flex items-center gap-4 rounded-2xl border border-[#f0f0f0] bg-white p-4 text-left transition-all duration-300 hover:border-[#e0e0e0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                assessment.completed ? 'bg-emerald-50 text-emerald-500' : 'bg-[#f5f5f5] text-[#b0b0b0]'
              }`}>
                <assessment.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#0a0a0a]">{assessment.name}</span>
                  {assessment.completed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600 border border-emerald-100">
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#737373] mt-0.5">{assessment.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#d4d4d4]" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => store.navigateTo(action.section)}
              className="rounded-2xl border border-[#f0f0f0] bg-white p-4 text-center transition-all duration-300 hover:border-[#e0e0e0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 flex flex-col items-center gap-3"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#0a0a0a]">{action.label}</span>
                <p className="text-xs text-[#737373] mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Getting Started Checklist */}
      <div className="card">
        <h3 className="text-sm font-semibold text-[#0a0a0a] mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 text-[#0c0c1d]" />
          Getting Started
        </h3>
        <div className="space-y-3">
          {gettingStarted.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-4.5 w-4.5 text-[#d4d4d4] shrink-0" />
              )}
              <span className={`text-sm ${item.done ? 'text-[#b0b0b0] line-through' : 'text-[#4a4a4a]'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
