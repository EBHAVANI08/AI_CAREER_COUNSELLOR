'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import type { CareerPathStep } from '@/types';
import {
  ArrowLeft, Loader2, Map, CheckCircle2, Circle,
  ChevronDown, ChevronUp, ExternalLink, Target,
} from 'lucide-react';

export default function CareerPathPage() {
  const {
    careerPath, setCareerPath, toggleStepComplete, navigateTo, goBack,
    user, userType, riasecResult, mbtiResult, careerQuizResult,
    skills, interests, education, targetRole, setTargetRole,
  } = useStore();

  const [roleInput, setRoleInput] = useState(targetRole || '');
  const [loading, setLoading] = useState(false);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const completedCount = careerPath.filter(s => s.completed).length;
  const progressPct = careerPath.length > 0 ? Math.round((completedCount / careerPath.length) * 100) : 0;

  const handleGenerate = async () => {
    if (!roleInput.trim()) return;

    setTargetRole(roleInput.trim());
    setLoading(true);

    try {
      const profile = {
        name: user?.name,
        email: user?.email,
        userType,
        riasecResult,
        mbtiResult,
        careerQuizResult,
        skills,
        interests,
        education,
        targetRole: roleInput.trim(),
      };

      const res = await fetch('/api/career-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole: roleInput.trim(), profile }),
      });

      const data = await res.json();
      if (data.steps) {
        setCareerPath(data.steps);
      }
    } catch (error) {
      console.error('Failed to generate career path:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="flex items-center gap-1 rounded-xl px-2 py-1.5 text-sm text-[#b0b0b0] transition-all hover:text-[#0a0a0a] hover:bg-[#f5f5f5]">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="section-title">Career Roadmap</h1>
      </div>

      {/* Input Section */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            placeholder="Enter target role (e.g., Full Stack Developer, Data Scientist)"
            className="premium-input flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={!roleInput.trim() || loading}
            className="premium-btn whitespace-nowrap"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Map className="h-4 w-4" />}
            {loading ? 'Generating...' : 'Generate Roadmap'}
          </button>
        </div>
        {targetRole && (
          <p className="text-xs text-[#737373] mt-2">
            Current target: <span className="font-medium text-[#0c0c1d]">{targetRole}</span>
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {careerPath.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[#4a4a4a]">
              Progress: {completedCount}/{careerPath.length} steps completed
            </span>
            <span className="text-sm font-bold text-[#0c0c1d]">{progressPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0c0c1d] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Timeline */}
      {careerPath.length > 0 ? (
        <div className="space-y-0">
          {careerPath.map((step, index) => {
            const isExpanded = expandedStep === step.id;
            const isLast = index === careerPath.length - 1;

            return (
              <div key={step.id} className="relative flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => toggleStepComplete(step.id)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all z-10 ${
                      step.completed
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-[#d4d4d4] bg-white text-[#b0b0b0] hover:border-[#0c0c1d]'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </button>
                  {!isLast && (
                    <div className={`w-0.5 flex-1 min-h-8 ${step.completed ? 'bg-emerald-300' : 'bg-[#d4d4d4]'}`} />
                  )}
                </div>

                {/* Step Content */}
                <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
                  <div
                    className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                      step.completed
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : isExpanded
                        ? 'border-[#e0e0e0] bg-[#fafafa] shadow-sm'
                        : 'border-[#f0f0f0] bg-white hover:border-[#e0e0e0]'
                    }`}
                    onClick={() => toggleExpand(step.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-sm font-bold ${step.completed ? 'text-emerald-700' : 'text-[#0a0a0a]'}`}>
                            {step.title}
                          </h3>
                          <span className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-[#0a0a0a] border border-[#ebebeb]">
                            {step.timeline}
                          </span>
                        </div>
                        <p className="text-xs text-[#737373] mt-1 line-clamp-2">{step.description}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-[#b0b0b0] shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#b0b0b0] shrink-0" />
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-3 animate-fade-in">
                        {/* Skills */}
                        {step.skills.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-[#737373]">Skills:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {step.skills.map(skill => (
                                <span key={skill} className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-[#4a4a4a] border border-[#ebebeb]">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Milestones */}
                        {step.milestones.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-[#737373]">Milestones:</span>
                            <ul className="mt-1 space-y-1">
                              {step.milestones.map((m, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-[#4a4a4a]">
                                  <Target className="h-3 w-3 text-[#0c0c1d] shrink-0 mt-0.5" />
                                  {m}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Resources */}
                        {step.resources.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-[#737373]">Resources:</span>
                            <ul className="mt-1 space-y-1">
                              {step.resources.map((r, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-[#4a4a4a]">
                                  <ExternalLink className="h-3 w-3 text-[#0c0c1d] shrink-0 mt-0.5" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !loading ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f5] mb-4 border border-[#ebebeb]">
            <Map className="h-7 w-7 text-[#b0b0b0]" />
          </div>
          <h3 className="text-base font-semibold text-[#0a0a0a] mb-1">No roadmap yet</h3>
          <p className="text-sm text-[#737373] max-w-sm">
            Enter your target role above and generate a personalized career roadmap with step-by-step guidance.
          </p>
        </div>
      ) : null}
    </div>
  );
}
