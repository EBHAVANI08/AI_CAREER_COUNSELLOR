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
  const [aiRouting, setAiRouting] = useState<AIRoutingResult | null>(null);
  const [routingLoading, setRoutingLoading] = useState(false);

  const profileCompleteness = store.profileCompleteness();
  const completedAssessments = store.completedAssessmentCount();

  useEffect(() => {
    if (!store.aiRouting) {
      fetchAIRouting();
    } else {
      setAiRouting(store.aiRouting);
    }
  }, []);

  const fetchAIRouting = async () => {
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
  };

  const assessments = [
    { id: 'riasec', name: 'RIASEC Assessment', desc: 'Career personality type', icon: Target, completed: !!store.riasecResult },
    { id: 'mbti', name: 'MBTI Assessment', desc: 'Work personality style', icon: Brain, completed: !!store.mbtiResult },
    { id: 'quiz', name: 'Career Quiz', desc: 'Ideal career field', icon: BarChart3, completed: !!store.careerQuizResult },
  ];

  const quickActions = [
    { label: 'AI Coach', desc: 'Get personalized guidance', icon: MessageSquare, section: 'chat' as const, color: 'bg-indigo-50 text-indigo-500' },
    { label: 'Career Roadmap', desc: 'Generate your career path', icon: Map, section: 'career-path' as const, color: 'bg-emerald-50 text-emerald-500' },
    { label: 'Discover', desc: 'Courses & internships', icon: Compass, section: 'discover' as const, color: 'bg-amber-50 text-amber-500' },
    { label: 'Build Resume', desc: 'ATS-optimized resume', icon: FileText, section: 'resume' as const, color: 'bg-rose-50 text-rose-500' },
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {getGreeting()}, {store.user?.name || 'Student'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {getDateStr()}
            {store.countryName && <span> &middot; {store.countryName}</span>}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
          <Sparkles className="h-3 w-3" /> CareerAI
        </span>
      </div>

      {/* AI Smart Recommendation */}
      <div className="ai-card">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white">
            <Zap className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              AI Smart Recommendation
              {routingLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />}
            </h3>
            {aiRouting ? (
              <div className="mt-2 space-y-2.5">
                <p className="text-sm text-gray-600 leading-relaxed">{aiRouting.reasoning}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">
                    {aiRouting.primaryPath}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
                    {aiRouting.secondaryPath}
                  </span>
                </div>
                {aiRouting.recommendedActions?.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {aiRouting.recommendedActions.slice(0, 3).map((action) => (
                      <button
                        key={action.id}
                        onClick={() => store.navigateTo(action.section as any)}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-600 transition-colors"
                      >
                        {action.label} <ArrowRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : !routingLoading ? (
              <p className="text-sm text-gray-500 mt-1">Complete assessments for personalized recommendations</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Profile Strength + Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Strength */}
        <div className="card flex flex-col items-center justify-center">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile Strength</h3>
          <div className="relative h-24 w-24">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#6366F1" strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{profileCompleteness}%</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 text-center">
            {profileCompleteness < 40 ? 'Add more details to strengthen your profile' :
             profileCompleteness < 70 ? 'Good progress. Keep going.' :
             profileCompleteness < 100 ? 'Almost there. Complete remaining items.' : 'Profile complete.'}
          </p>
        </div>

        {/* Assessment Cards */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Assessments ({completedAssessments}/3)
            </h3>
            <button
              onClick={() => store.navigateTo('assessments')}
              className="text-xs text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {assessments.map((assessment) => (
            <button
              key={assessment.id}
              onClick={() => store.navigateTo('assessments')}
              className="w-full flex items-center gap-4 rounded-xl border border-gray-200/80 bg-white p-4 text-left transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                assessment.completed ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'
              }`}>
                <assessment.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{assessment.name}</span>
                  {assessment.completed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600 border border-emerald-100">
                      <CheckCircle2 className="h-3 w-3" /> Done
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{assessment.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => store.navigateTo(action.section)}
              className="rounded-xl border border-gray-200/80 bg-white p-4 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5 flex flex-col items-center gap-3"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-900">{action.label}</span>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Getting Started Checklist */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-500" />
          Getting Started
        </h3>
        <div className="space-y-3">
          {gettingStarted.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-4.5 w-4.5 text-gray-300 shrink-0" />
              )}
              <span className={`text-sm ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
