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
          <button onClick={goBack} className="btn-ghost py-1.5 px-3">
            <ArrowLeft className="h-4 w-4" /> Back
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
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                    isTop ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{fieldData.name}</h3>
                      <span className="text-sm font-semibold text-violet-600">{field.matchPercentage}% match</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <TrendingUp className="h-3 w-3 text-green-500" /> {fieldData.growthPercent}% growth
                      <span>•</span>
                      <span>{fieldData.demandLevel} demand</span>
                    </div>
                    <div className="mb-3">
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-violet-500 animate-progress"
                          style={{ width: `${field.matchPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {fieldData.hotRoles.slice(0, 3).map(role => (
                        <span key={role} className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">{role}</span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      💰 {fieldData.salaryRanges.entry} (Entry) • {fieldData.salaryRanges.mid} (Mid) • {fieldData.salaryRanges.senior} (Senior)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Field Scores */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">All Field Scores</h3>
          <div className="space-y-2">
            {Object.entries(careerQuizResult.fieldScores)
              .sort((a, b) => b[1] - a[1])
              .map(([field, score]) => {
                const fd = careerFields[field];
                return (
                  <div key={field} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-600 w-24 truncate">{fd?.name || field}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-violet-400" style={{ width: `${Math.min(score * 1.5, 100)}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 w-8 text-right">{score}%</span>
                  </div>
                );
              })}
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
  const question = careerQuizQuestions[currentQ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={goBack} className="btn-ghost py-1.5 px-3">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-sm text-gray-500">Question {currentQ + 1} of {totalQuestions}</span>
      </div>

      <div>
        <h1 className="section-title">Career Quiz</h1>
        <p className="section-subtitle">Discover which career field matches your interests</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((option, i) => {
            const isSelected = answers[currentQ] === i;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 bg-white hover:border-violet-200 hover:bg-violet-50/50'
                }`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isSelected ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-violet-700' : 'text-gray-700'}`}>
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
