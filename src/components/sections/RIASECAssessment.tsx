'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { riasecQuestions, riasecDescriptions } from '@/lib/assessment-data';
import type { RIASECResult } from '@/types';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Brain, BarChart3 } from 'lucide-react';
import SectionHeader from '@/components/layout/SectionHeader';

export default function RIASECAssessment() {
  const { setRiasecResult, riasecResult, navigateTo, goBack } = useStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(!!riasecResult);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const totalQuestions = riasecQuestions.length;
  const progress = ((Object.keys(answers).length) / totalQuestions) * 100;
  const isFinished = Object.keys(answers).length === totalQuestions;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQ]: value };
    setAnswers(newAnswers);

    // Auto-advance after a short delay
    if (currentQ < totalQuestions - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  const calculateResults = () => {
    const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const counts: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    for (const [qIndex, value] of Object.entries(answers)) {
      const question = riasecQuestions[parseInt(qIndex)];
      if (question) {
        scores[question.category] += value;
        counts[question.category] += 1;
      }
    }

    // Normalize scores to 0-100
    const normalized: Record<string, number> = {};
    for (const key of Object.keys(scores)) {
      const maxPossible = (counts[key] || 1) * 5;
      normalized[key] = Math.round((scores[key] / maxPossible) * 100);
    }

    // Find top code and top two code
    const sorted = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
    const topCode = sorted[0][0];
    const topTwoCode = sorted[0][0] + sorted[1][0];

    const result: RIASECResult = {
      scores: normalized as RIASECResult['scores'],
      topCode,
      topTwoCode,
      completedAt: new Date().toISOString(),
    };

    setRiasecResult(result);
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
  if (showResults && riasecResult) {
    const desc = riasecDescriptions[riasecResult.topCode];
    const scoreEntries = Object.entries(riasecResult.scores).sort((a, b) => b[1] - a[1]);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="section-title">RIASEC Results</h1>
        </div>

        {/* Top Type Card */}
        <div className="ai-card">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-indigo-500" />
            <span className="text-lg font-bold text-gray-900 tracking-tight">{desc.title}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{desc.description}</p>
          <div className="flex flex-wrap gap-2">
            {desc.traits.map(trait => (
              <span key={trait} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100">{trait}</span>
            ))}
          </div>
        </div>

        {/* Score Bars */}
        <div className="card">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Score Breakdown
          </h3>
          <div className="space-y-3">
            {scoreEntries.map(([code, score]) => {
              const d = riasecDescriptions[code];
              const isTop = code === riasecResult.topCode;
              return (
                <div key={code} className={`p-3 rounded-lg ${isTop ? 'bg-indigo-50 border border-indigo-100' : ''}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-semibold ${isTop ? 'text-indigo-700' : 'text-gray-600'}`}>
                      {code} — {d.title.split('—')[0].trim()}
                    </span>
                    <span className={`text-xs font-bold ${isTop ? 'text-indigo-700' : 'text-gray-900'}`}>{score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full animate-progress ${isTop ? 'bg-indigo-500' : 'bg-gray-400'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Career Tags */}
        <div className="card">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Career Matches</h3>
          <div className="flex flex-wrap gap-2">
            {desc.careers.map(career => (
              <span key={career} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-100">{career}</span>
            ))}
          </div>
        </div>

        {/* AI Analysis */}
        <div className="card">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-indigo-500" /> AI Analysis
          </h3>
          {analysis ? (
            <p className="text-sm text-gray-700 leading-relaxed">{analysis}</p>
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
  const question = riasecQuestions[currentQ];
  const likertLabels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={goBack} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
        </button>
        <span className="text-sm text-gray-500">Question {currentQ + 1} of {totalQuestions}</span>
      </div>

      <div>
        <h1 className="section-title">RIASEC Assessment</h1>
        <p className="section-subtitle">Rate how much each statement describes you</p>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300 animate-progress"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="card">
        <p className="text-lg font-medium text-gray-900 mb-6">{question.text}</p>
        <div className="space-y-2">
          {likertLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i + 1)}
              className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                answers[currentQ] === i + 1
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                answers[currentQ] === i + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-50 border border-gray-200 text-gray-500'
              }`}>
                {answers[currentQ] === i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
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

        {/* Question dots */}
        <div className="hidden sm:flex gap-1">
          {riasecQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentQ ? 'bg-indigo-500 w-4' : answers[i] !== undefined ? 'bg-indigo-300' : 'bg-gray-200'
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
