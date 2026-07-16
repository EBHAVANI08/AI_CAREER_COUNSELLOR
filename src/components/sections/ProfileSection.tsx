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

  const handleSave = async () => {
    const skills = skillsVal.split(',').map(s => s.trim()).filter(Boolean);
    const interests = interestsVal.split(',').map(s => s.trim()).filter(Boolean);
    const selectedCountry = countries.find(x => x.code === countryVal);
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), country: countryVal, countryName: selectedCountry?.name || countryVal, education: educationVal.trim(), skills, interests, targetRole: targetRoleVal.trim() }),
    });
    if (!response.ok) return;
    if (name.trim()) store.setUserName(name.trim());
    if (countryVal) {
      store.setCountry(countryVal, selectedCountry?.name || countryVal);
    }
    store.setEducation(educationVal.trim());
    store.setSkills(skills);
    store.setInterests(interests);
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
      setAnalysis({ summary: 'Unable to analyze right now. Please try again later.', strengths: [], careerMatches: [], skillGaps: [], recommendations: [], crossAssessmentInsights: [] });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const profileCompleteness = store.profileCompleteness();
  const completedAssessments = store.completedAssessmentCount();

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Profile" subtitle="Manage your career profile and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Editable Fields */}
        <div className="rounded-2xl border border-[#f0f0f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-4">Personal Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="premium-input" placeholder="Your full name" />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Country
              </label>
              <select
                value={countryVal}
                onChange={(e) => setCountryVal(e.target.value)}
                className="premium-input"
              >
                <option value="">Select country...</option>
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">Education</label>
              <input type="text" value={educationVal} onChange={(e) => setEducationVal(e.target.value)} className="premium-input" placeholder="e.g., B.Tech Computer Science, IIT Delhi" />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">Skills (comma-separated)</label>
              <input type="text" value={skillsVal} onChange={(e) => setSkillsVal(e.target.value)} className="premium-input" placeholder="Python, React, Machine Learning, SQL" />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">Interests (comma-separated)</label>
              <input type="text" value={interestsVal} onChange={(e) => setInterestsVal(e.target.value)} className="premium-input" placeholder="AI, Startups, Music, Photography" />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">Target Role</label>
              <input type="text" value={targetRoleVal} onChange={(e) => setTargetRoleVal(e.target.value)} className="premium-input" placeholder="e.g., Full Stack Developer, Data Scientist" />
            </div>
          </div>

          <button onClick={handleSave} className="w-full mt-6 premium-btn">
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>

        {/* Right: Assessment Summary + AI Analysis */}
        <div className="space-y-4">
          {/* Profile Completeness */}
          <div className="rounded-2xl border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">Profile Strength</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
                  <div className="h-full rounded-full bg-[#0c0c1d] transition-all" style={{ width: `${profileCompleteness}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-[#0c0c1d]">{profileCompleteness}%</span>
            </div>
          </div>

          {/* Assessment Results Summary */}
          <div className="rounded-2xl border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3">Assessment Results</h3>
            <div className="space-y-2.5">
              <div className={`flex items-center gap-3 p-3 rounded-xl ${store.riasecResult ? 'bg-[#f5f5f5] border border-[#ebebeb]' : 'bg-[#fafafa] border border-[#f0f0f0]'}`}>
                <Target className={`h-4.5 w-4.5 ${store.riasecResult ? 'text-[#0c0c1d]' : 'text-[#d4d4d4]'}`} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-[#0a0a0a]">RIASEC</span>
                  {store.riasecResult ? <p className="text-xs text-emerald-600">Top: {store.riasecResult.topTwoCode}</p> : <p className="text-xs text-[#b0b0b0]">Not completed</p>}
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${store.mbtiResult ? 'bg-[#f5f5f5] border border-[#ebebeb]' : 'bg-[#fafafa] border border-[#f0f0f0]'}`}>
                <Brain className={`h-4.5 w-4.5 ${store.mbtiResult ? 'text-[#0c0c1d]' : 'text-[#d4d4d4]'}`} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-[#0a0a0a]">MBTI</span>
                  {store.mbtiResult ? <p className="text-xs text-emerald-600">Type: {store.mbtiResult.type}</p> : <p className="text-xs text-[#b0b0b0]">Not completed</p>}
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${store.careerQuizResult ? 'bg-[#f5f5f5] border border-[#ebebeb]' : 'bg-[#fafafa] border border-[#f0f0f0]'}`}>
                <BarChart3 className={`h-4.5 w-4.5 ${store.careerQuizResult ? 'text-[#0c0c1d]' : 'text-[#d4d4d4]'}`} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-[#0a0a0a]">Career Quiz</span>
                  {store.careerQuizResult && store.careerQuizResult.topFields.length > 0 ? <p className="text-xs text-emerald-600">Top: {store.careerQuizResult.topFields[0].field}</p> : <p className="text-xs text-[#b0b0b0]">Not completed</p>}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#737373] mt-3">{completedAssessments}/3 assessments completed</p>
          </div>

          {/* AI Analysis */}
          <div className="rounded-2xl border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#0c0c1d]" /> AI Cross-Assessment Analysis
            </h3>
            {analysis ? (
              <div className="space-y-3">
                {analysis.summary && <p className="text-sm text-[#4a4a4a] leading-relaxed">{analysis.summary}</p>}
                {analysis.strengths?.length > 0 && (
                  <div><span className="text-xs font-semibold text-[#737373]">Strengths:</span>
                    <div className="flex flex-wrap gap-1 mt-1">{analysis.strengths.map((s: string, i: number) => (<span key={i} className="rounded-full bg-[#f5f0e6] px-2 py-0.5 text-xs text-[#b8965a] border border-[#b8965a]/30">{s}</span>))}</div>
                  </div>
                )}
                {analysis.careerMatches?.length > 0 && (
                  <div><span className="text-xs font-semibold text-[#737373]">Career Matches:</span>
                    <div className="flex flex-wrap gap-1 mt-1">{analysis.careerMatches.map((c: string, i: number) => (<span key={i} className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs text-[#0a0a0a] border border-[#ebebeb]">{c}</span>))}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-[#737373] mb-3">Get personalized insights by analyzing your assessment results with AI</p>
                <button onClick={handleGetAIAnalysis} disabled={analysisLoading} className="premium-btn">
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
