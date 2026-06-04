'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { careerQuizQuestions } from '@/lib/assessment-data';
import { careerFields } from '@/lib/ai/knowledge';
import type { CareerQuizResult } from '@/types';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Brain, TrendingUp } from 'lucide-react';
import SectionHeader from '@/components/layout/SectionHeader';

export default function CareerQuiz() {
  const { setCareerQuizResult, careerQuizResult, navigateTo, goBack } = useStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // qIndex -> optionIndex
  const [showResults, setShowResults] = useState(!!careerQuizResult);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const totalQuestions = careerQuizQuestions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;
  const isFinished = Object.keys(answers).length === totalQuestions;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQ]: optionIndex };
    setAnswers(newAnswers);

    if (currentQ < totalQuestions - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  const calculateResults = () => {
    const fieldScores: Record<string, number> = {};
    const fieldCounts: Record<string, number> = {};

    for (const [qIndex, optIndex] of Object.entries(answers)) {
      const question = careerQuizQuestions[parseInt(qIndex)];
      if (!question) continue;
      const field = question.options[optIndex]?.field;
      if (field) {
        fieldScores[field] = (fieldScores[field] || 0) + 1;
        fieldCounts[field] = (fieldCounts[field] || 0) + 1;
      }
    }

    // Normalize to percentages
    const total = Object.keys(answers).length;
    const normalized: Record<string, number> = {};
    for (const [field, score] of Object.entries(fieldScores)) {
      normalized[field] = Math.round((score / total) * 100);
    }

    // Sort and get top fields
    const sortedFields = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
    const topFields = sortedFields.slice(0, 3).map(([field, score]) => ({
      field,
      score,
      matchPercentage: Math.min(Math.round(score * 1.5), 98),
    }));

    const result: CareerQuizResult = {
      fieldScores: normalized,
      topFields,
      completedAt: new Date().toISOString(),
    };

    setCareerQuizResult(result);
    setShowResults(true);
  };

  const handleGetAIAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const profile = {
        name: useStore.getState().user?.name,
        email: useStore.getState().user?.email,
        userType: useStore.getState().userType,
        riasecResult: useStore.getState().riasecResult,
        mbtiResult: useStore.getState().mbtiResult,
        careerQuizResult: useStore.getState().careerQuizResult,
        skills: useStore.getState().skills,
        interests: useStore.getState().interests,
        education: useStore.getState().education,
        targetRole: useStore.getState().targetRole,
      };
      const res = await fetch('/api/assessment-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setAnalysis(data.summary || 'Analysis complete. Chat with AI for detailed insights.');
    } catch {
      setAnalysis('Unable to get AI analysis right now. Try again later.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Results View
  if (showResults && careerQuizResult) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="flex items-center gap-1 rounded-xl px-2 py-1.5 text-sm text-[#b0b0b0] transition-all hover:text-[#0a0a0a] hover:bg-[#f5f5f5]">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="section-title">Career Quiz Results</h1>
        </div>

        {/* Top 3 Fields */}
        <div className="space-y-4">
          {careerQuizResult.topFields.map((field, i) => {
            const fieldData = careerFields[field.field];
            if (!fieldData) return null;
            const isTop = i === 0;
            return (
              <div key={field.field} className={isTop ? 'ai-card' : 'card'}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    isTop ? 'bg-[#0c0c1d] text-white' : 'bg-[#f5f5f5] text-[#4a4a4a]'
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-[#0a0a0a] tracking-tight">{fieldData.name}</h3>
                      <span className="text-sm font-semibold text-[#0c0c1d]">{field.matchPercentage}% match</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#737373] mb-3">
                      <TrendingUp className="h-3 w-3 text-emerald-500" /> {fieldData.growthPercent}% growth
                      <span>&middot;</span>
                      <span>{fieldData.demandLevel} demand</span>
                    </div>
                    <div className="mb-3">
                      <div className="h-1.5 rounded-full bg-[#f0f0f0] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0c0c1d] animate-progress"
                          style={{ width: `${field.matchPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {fieldData.hotRoles.slice(0, 3).map(role => (
                        <span key={role} className="rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs font-medium text-[#0a0a0a] border border-[#ebebeb]">{role}</span>
                      ))}
                    </div>
                    <div className="text-xs text-[#737373]">
                      {fieldData.salaryRanges.entry} (Entry) &middot; {fieldData.salaryRanges.mid} (Mid) &middot; {fieldData.salaryRanges.senior} (Senior)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Field Scores */}
        <div className="card">
          <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-4">All Field Scores</h3>
          <div className="space-y-2.5">
            {Object.entries(careerQuizResult.fieldScores)
              .sort((a, b) => b[1] - a[1])
              .map(([field, score]) => {
                const fd = careerFields[field];
                return (
                  <div key={field} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[#4a4a4a] w-24 truncate">{fd?.name || field}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#f0f0f0] overflow-hidden">
                      <div className="h-full rounded-full bg-[#0c0c1d]" style={{ width: `${Math.min(score * 1.5, 100)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[#737373] w-8 text-right">{score}%</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="card">
          <h3 className="text-xs font-semibold text-[#737373] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#0c0c1d]" /> AI Analysis
          </h3>
          {analysis ? (
            <p className="text-sm text-[#4a4a4a] leading-relaxed">{analysis}</p>
          ) : (
            <button
              onClick={handleGetAIAnalysis}
              disabled={analysisLoading}
              className="premium-btn text-sm"
            >
              {analysisLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              {analysisLoading ? 'Analyzing...' : 'Get AI Analysis'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Assessment View
  const question = careerQuizQuestions[currentQ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={goBack} className="flex items-center gap-1 rounded-xl px-2 py-1.5 text-sm text-[#b0b0b0] transition-all hover:text-[#0a0a0a] hover:bg-[#f5f5f5]">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
        </button>
        <span className="text-sm text-[#737373]">Question {currentQ + 1} of {totalQuestions}</span>
      </div>

      <div>
        <h1 className="section-title">Career Quiz</h1>
        <p className="section-subtitle">Discover which career field matches your interests</p>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full bg-[#f0f0f0] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#0c0c1d] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="card">
        <p className="text-lg font-medium text-[#0a0a0a] mb-6">{question.text}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, i) => {
            const isSelected = answers[currentQ] === i;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-[#0c0c1d] bg-[#f5f5f5]'
                    : 'border-[#ebebeb] bg-white hover:border-[#d4d4d4] hover:bg-[#fafafa]'
                }`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isSelected ? 'bg-[#0c0c1d] text-white' : 'bg-[#f5f5f5] text-[#737373] border border-[#ebebeb]'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-[#0a0a0a]' : 'text-[#4a4a4a]'}`}>
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
          className="btn-secondary"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </button>

        <div className="hidden sm:flex gap-1">
          {careerQuizQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentQ ? 'bg-[#0c0c1d] w-4' : answers[i] !== undefined ? 'bg-[#d4d4d4]' : 'bg-[#ebebeb]'
              }`}
            />
          ))}
        </div>

        {isFinished ? (
          <button onClick={calculateResults} className="premium-btn">
            See Results <CheckCircle2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(Math.min(totalQuestions - 1, currentQ + 1))}
            disabled={answers[currentQ] === undefined}
            className="premium-btn"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
