'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { mbtiQuestions, mbtiDescriptions } from '@/lib/assessment-data';
import type { MBTIResult } from '@/types';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Brain } from 'lucide-react';
import SectionHeader from '@/components/layout/SectionHeader';

export default function MBTIAssessment() {
  const { setMbtiResult, mbtiResult, navigateTo, goBack } = useStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [showResults, setShowResults] = useState(!!mbtiResult);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const totalQuestions = mbtiQuestions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;
  const isFinished = Object.keys(answers).length === totalQuestions;

  const handleAnswer = (choice: 'A' | 'B') => {
    const newAnswers = { ...answers, [currentQ]: choice };
    setAnswers(newAnswers);

    if (currentQ < totalQuestions - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    }
  };

  const calculateResults = () => {
    const dimensions: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    for (const [qIndex, choice] of Object.entries(answers)) {
      const question = mbtiQuestions[parseInt(qIndex)];
      if (!question) continue;
      const selected = choice === 'A' ? question.optionA : question.optionB;
      dimensions[selected.value] += 1;
    }

    // Normalize to percentages
    const total = Object.keys(answers).length;
    const normalized: MBTIResult['dimensions'] = {
      E: Math.round((dimensions.E / total) * 100),
      I: Math.round((dimensions.I / total) * 100),
      S: Math.round((dimensions.S / total) * 100),
      N: Math.round((dimensions.N / total) * 100),
      T: Math.round((dimensions.T / total) * 100),
      F: Math.round((dimensions.F / total) * 100),
      J: Math.round((dimensions.J / total) * 100),
      P: Math.round((dimensions.P / total) * 100),
    };

    // Determine MBTI type
    const type = [
      dimensions.E >= dimensions.I ? 'E' : 'I',
      dimensions.S >= dimensions.N ? 'S' : 'N',
      dimensions.T >= dimensions.F ? 'T' : 'F',
      dimensions.J >= dimensions.P ? 'J' : 'P',
    ].join('');

    const result: MBTIResult = {
      dimensions: normalized,
      type,
      completedAt: new Date().toISOString(),
    };

    setMbtiResult(result);
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
  if (showResults && mbtiResult) {
    const desc = mbtiDescriptions[mbtiResult.type];

    const sliders = [
      { left: 'E', right: 'I', leftLabel: 'Extraversion', rightLabel: 'Introversion', leftVal: mbtiResult.dimensions.E, rightVal: mbtiResult.dimensions.I },
      { left: 'S', right: 'N', leftLabel: 'Sensing', rightLabel: 'Intuition', leftVal: mbtiResult.dimensions.S, rightVal: mbtiResult.dimensions.N },
      { left: 'T', right: 'F', leftLabel: 'Thinking', rightLabel: 'Feeling', leftVal: mbtiResult.dimensions.T, rightVal: mbtiResult.dimensions.F },
      { left: 'J', right: 'P', leftLabel: 'Judging', rightLabel: 'Perceiving', leftVal: mbtiResult.dimensions.J, rightVal: mbtiResult.dimensions.P },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="btn-ghost py-1.5 px-3">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="section-title">MBTI Results</h1>
        </div>

        {/* Type Card */}
        <div className="ai-card">
          <div className="text-center">
            <div className="text-4xl font-bold text-violet-700 mb-2">{mbtiResult.type}</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">{desc.title}</div>
            <p className="text-sm text-gray-600">{desc.description}</p>
          </div>
        </div>

        {/* Dimension Sliders */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Your Dimensions</h3>
          <div className="space-y-4">
            {sliders.map((s) => {
              const leftPct = Math.round((s.leftVal / (s.leftVal + s.rightVal || 1)) * 100);
              return (
                <div key={s.left}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-medium ${leftPct > 50 ? 'text-violet-700' : 'text-gray-500'}`}>
                      {s.left} — {s.leftLabel}
                    </span>
                    <span className={`font-medium ${leftPct < 50 ? 'text-violet-700' : 'text-gray-500'}`}>
                      {s.right} — {s.rightLabel}
                    </span>
                  </div>
                  <div className="relative h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-l-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${leftPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                    <span>{leftPct}%</span>
                    <span>{100 - leftPct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Careers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {desc.strengths.map(s => (
                <span key={s} className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">{s}</span>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Career Matches</h3>
            <div className="flex flex-wrap gap-2">
              {desc.careers.map(c => (
                <span key={c} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-500" /> AI Analysis
          </h3>
          {analysis ? (
            <p className="text-sm text-gray-700">{analysis}</p>
          ) : (
            <button
              onClick={handleGetAIAnalysis}
              disabled={analysisLoading}
              className="btn-primary text-sm"
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
  const question = mbtiQuestions[currentQ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={goBack} className="btn-ghost py-1.5 px-3">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-sm text-gray-500">Question {currentQ + 1} of {totalQuestions}</span>
      </div>

      <div>
        <h1 className="section-title">MBTI Assessment</h1>
        <p className="section-subtitle">Choose the option that best describes you</p>
      </div>

      {/* Progress Bar */}
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="card">
        <p className="text-lg font-medium text-gray-900 mb-6">{question.text}</p>
        <div className="space-y-3">
          {[question.optionA, question.optionB].map((option, i) => {
            const choice = i === 0 ? 'A' : 'B';
            const isSelected = answers[currentQ] === choice;
            return (
              <button
                key={choice}
                onClick={() => handleAnswer(choice as 'A' | 'B')}
                className={`w-full flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-violet-200 hover:bg-violet-50/50'
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isSelected ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {choice}
                </div>
                <span className="text-sm font-medium">{option.text}</span>
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
          {mbtiQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === currentQ ? 'bg-violet-500 w-4' : answers[i] !== undefined ? 'bg-violet-300' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {isFinished ? (
          <button onClick={calculateResults} className="btn-primary">
            See Results <CheckCircle2 className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ(Math.min(totalQuestions - 1, currentQ + 1))}
            disabled={answers[currentQ] === undefined}
            className="btn-primary"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
