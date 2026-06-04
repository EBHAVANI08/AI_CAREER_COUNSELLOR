'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import SectionHeader from '@/components/layout/SectionHeader';
import { ArrowLeft, Save, Loader2, Brain, CheckCircle2, Target, BarChart3, Globe } from 'lucide-react';
import { countries } from '@/lib/ai/knowledge';

export default function ProfileSection() {
  const store = useStore();
  const [name, setName] = useState(store.user?.name || '');
  const [educationVal, setEducationVal] = useState(store.education);
  const [skillsVal, setSkillsVal] = useState(store.skills.join(', '));
  const [interestsVal, setInterestsVal] = useState(store.interests.join(', '));
  const [targetRoleVal, setTargetRoleVal] = useState(store.targetRole);
  const [countryVal, setCountryVal] = useState(store.country);
  const [saved, setSaved] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState(store.assessmentAnalysis);

  const handleSave = () => {
    if (name.trim() && store.user) {
      store.user.name = name;
    }
    if (countryVal) {
      const c = countries.find(x => x.code === countryVal);
      store.setCountry(countryVal, c?.name || countryVal);
    }
    store.setEducation(educationVal.trim());
    store.setSkills(skillsVal.split(',').map(s => s.trim()).filter(Boolean));
    store.setInterests(interestsVal.split(',').map(s => s.trim()).filter(Boolean));
    store.setTargetRole(targetRoleVal.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleGetAIAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const profile = {
        name: store.user?.name,
        email: store.user?.email,
        userType: store.userType,
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
      const res = await fetch('/api/assessment-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setAnalysis(data);
      store.setAssessmentAnalysis(data);
    } catch {
      setAnalysis({ summary: 'Unable to analyze right now. Please try again later.' });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const profileCompleteness = store.profileCompleteness();
  const completedAssessments = store.completedAssessmentCount();

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Profile" subtitle="Manage your career profile and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Editable Fields */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Personal Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" placeholder="Your full name" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Country
              </label>
              <select
                value={countryVal}
                onChange={(e) => setCountryVal(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              >
                <option value="">Select country...</option>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Education</label>
              <input type="text" value={educationVal} onChange={(e) => setEducationVal(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" placeholder="e.g., B.Tech Computer Science, IIT Delhi" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Skills (comma-separated)</label>
              <input type="text" value={skillsVal} onChange={(e) => setSkillsVal(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" placeholder="Python, React, Machine Learning, SQL" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Interests (comma-separated)</label>
              <input type="text" value={interestsVal} onChange={(e) => setInterestsVal(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" placeholder="AI, Startups, Music, Photography" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target Role</label>
              <input type="text" value={targetRoleVal} onChange={(e) => setTargetRoleVal(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" placeholder="e.g., Full Stack Developer, Data Scientist" />
            </div>
          </div>

          <button onClick={handleSave} className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>

        {/* Right: Assessment Summary + AI Analysis */}
        <div className="space-y-4">
          {/* Profile Completeness */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Profile Strength</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${profileCompleteness}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-violet-600">{profileCompleteness}%</span>
            </div>
          </div>

          {/* Assessment Results Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Assessment Results</h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${store.riasecResult ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Target className={`h-5 w-5 ${store.riasecResult ? 'text-green-500' : 'text-gray-300'}`} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">RIASEC</span>
                  {store.riasecResult ? <p className="text-xs text-green-600">Top: {store.riasecResult.topTwoCode}</p> : <p className="text-xs text-gray-400">Not completed</p>}
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${store.mbtiResult ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Brain className={`h-5 w-5 ${store.mbtiResult ? 'text-green-500' : 'text-gray-300'}`} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">MBTI</span>
                  {store.mbtiResult ? <p className="text-xs text-green-600">Type: {store.mbtiResult.type}</p> : <p className="text-xs text-gray-400">Not completed</p>}
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${store.careerQuizResult ? 'bg-green-50' : 'bg-gray-50'}`}>
                <BarChart3 className={`h-5 w-5 ${store.careerQuizResult ? 'text-green-500' : 'text-gray-300'}`} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">Career Quiz</span>
                  {store.careerQuizResult && store.careerQuizResult.topFields.length > 0 ? <p className="text-xs text-green-600">Top: {store.careerQuizResult.topFields[0].field}</p> : <p className="text-xs text-gray-400">Not completed</p>}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">{completedAssessments}/3 assessments completed</p>
          </div>

          {/* AI Analysis */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-500" /> AI Cross-Assessment Analysis
            </h3>
            {analysis ? (
              <div className="space-y-3">
                {analysis.summary && <p className="text-sm text-gray-700">{analysis.summary}</p>}
                {analysis.strengths?.length > 0 && (
                  <div><span className="text-xs font-semibold text-gray-500">Strengths:</span>
                    <div className="flex flex-wrap gap-1 mt-1">{analysis.strengths.map((s: string, i: number) => (<span key={i} className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">{s}</span>))}</div>
                  </div>
                )}
                {analysis.careerMatches?.length > 0 && (
                  <div><span className="text-xs font-semibold text-gray-500">Career Matches:</span>
                    <div className="flex flex-wrap gap-1 mt-1">{analysis.careerMatches.map((c: string, i: number) => (<span key={i} className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">{c}</span>))}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500 mb-3">Get personalized insights by analyzing your assessment results with AI</p>
                <button onClick={handleGetAIAnalysis} disabled={analysisLoading} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
                  {analysisLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                  {analysisLoading ? 'Analyzing...' : 'Get AI Analysis'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
