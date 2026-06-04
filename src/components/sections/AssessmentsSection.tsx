'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import SectionHeader from '@/components/layout/SectionHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { AppSection } from '@/types';
import {
  Target, Brain, BarChart3, CheckCircle2, Circle,
  Clock, BookOpen, Award, Users, Lightbulb,
  ChevronRight, ArrowRight, Sparkles, Shield,
} from 'lucide-react';

interface AssessmentMeta {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  theory: string;
  accuracy: string;
  timeRequired: string;
  numQuestions: number;
  section: AppSection;
  status: 'completed' | 'not-started';
  resultPreview?: string;
}

const assessmentTheoryDetails: Record<string, { theory: string; methodology: string; measures: string; sampleQuestion: string }> = {
  riasec: {
    theory: "John Holland's RIASEC theory (1959) proposes that career choice is an expression of personality. Holland identified six personality types: Realistic (R), Investigative (I), Artistic (A), Social (S), Enterprising (E), and Conventional (C). People seek environments that match their type, and congruence between personality and environment leads to satisfaction and success.",
    methodology: "The RIASEC assessment uses a Likert-scale questionnaire measuring preferences across 6 dimensions. Your top 2-3 codes form your Holland Code (e.g., 'IA' or 'SEC'), which maps to career environments. The assessment has been validated across 50+ countries with 85%+ accuracy in predicting career satisfaction.",
    measures: "Measures your orientation toward: Working with Things (R), Ideas (I), People/Self (A), Helping (S), Persuading (E), and Organization (C). It identifies your natural work preferences and ideal career environments.",
    sampleQuestion: "'I enjoy working with tools, machines, or my hands to build or fix things.' — Rate from Strongly Disagree to Strongly Agree on a 5-point scale."
  },
  mbti: {
    theory: "The Myers-Briggs Type Indicator (1943) is based on Carl Jung's theory of psychological types. It classifies individuals along 4 dimensions: Extraversion/Introversion (energy source), Sensing/Intuition (information gathering), Thinking/Feeling (decision making), and Judging/Perceiving (lifestyle orientation), creating 16 distinct personality types.",
    methodology: "The MBTI uses forced-choice questions where you select between two alternatives representing opposite poles of each dimension. Scores reflect the strength of your preference on each dimension. The instrument has been validated with millions of respondents and is used by 88 of Fortune 100 companies.",
    measures: "Measures your preferred way of: Getting energized (E/I), Taking in information (S/N), Making decisions (T/F), and Organizing your life (J/P). Understanding these preferences helps identify work styles and career fits.",
    sampleQuestion: "'At a social gathering, you typically: A) Engage with many people, including strangers OR B) Talk with a few people you already know'"
  },
  careerQuiz: {
    theory: "Our Career Field Quiz is based on the Theory of Work Adjustment (Dawis & Lofquist, 1984) which proposes that career satisfaction depends on the match between an individual's abilities/interests and job requirements/reinforcers. The quiz maps interests to specific career fields in the market.",
    methodology: "Uses situational preference questions where you choose between real-world scenarios aligned with different career fields (Technology, AI/ML, Design, Finance, Healthcare, Product Management). Results show your top 3 matching fields with percentage alignment based on response patterns.",
    measures: "Measures your interest alignment with 6 high-growth career fields: Software & IT, AI & Machine Learning, Product Management, UX/UI Design, Finance & Fintech, and Healthcare & Biotech.",
    sampleQuestion: "'Which work environment excites you the most? A) A tech startup building the next big app, B) A research lab pushing the boundaries of AI, C) A design studio creating beautiful products, D) A hospital or biotech company saving lives'"
  }
};

export default function AssessmentsSection() {
  const store = useStore();
  const [selectedTheory, setSelectedTheory] = useState<string | null>(null);

  const assessments: AssessmentMeta[] = [
    {
      id: 'riasec',
      name: 'RIASEC Personality Assessment',
      icon: Target,
      color: 'text-[#0c0c1d]',
      bgColor: 'bg-[#f5f5f5]',
      description: 'Discover your career personality type based on Holland\'s theory of vocational choice. Find careers that match your natural work preferences.',
      theory: "Based on John Holland's Theory of Career Choice (1959)",
      accuracy: 'Validated across 50+ countries with 85%+ accuracy',
      timeRequired: '15-20 minutes',
      numQuestions: 30,
      section: 'riasec',
      status: store.riasecResult ? 'completed' : 'not-started',
      resultPreview: store.riasecResult ? `${store.riasecResult.topTwoCode} — ${store.riasecResult.topCode} type dominant` : undefined,
    },
    {
      id: 'mbti',
      name: 'MBTI Personality Assessment',
      icon: Brain,
      color: 'text-[#b8965a]',
      bgColor: 'bg-[#f5f0e6]',
      description: 'Understand your work personality through the Myers-Briggs framework. Discover how your cognitive preferences shape your ideal career.',
      theory: 'Based on Carl Jung\'s psychological types (1921), adapted by Myers & Briggs (1943)',
      accuracy: 'Used by 88 of Fortune 100 companies, validated with millions of respondents',
      timeRequired: '10-15 minutes',
      numQuestions: 12,
      section: 'mbti',
      status: store.mbtiResult ? 'completed' : 'not-started',
      resultPreview: store.mbtiResult ? `Type: ${store.mbtiResult.type}` : undefined,
    },
    {
      id: 'career-quiz',
      name: 'Career Field Quiz',
      icon: BarChart3,
      color: 'text-[#4a4a4a]',
      bgColor: 'bg-[#f5f5f5]',
      description: 'Find your ideal career field among highest-growth sectors. Discover which industry matches your interests and values.',
      theory: 'Based on Theory of Work Adjustment (Dawis & Lofquist, 1984)',
      accuracy: 'Aligned with market data, 80%+ field-match accuracy',
      timeRequired: '8-10 minutes',
      numQuestions: 10,
      section: 'career-quiz',
      status: store.careerQuizResult ? 'completed' : 'not-started',
      resultPreview: store.careerQuizResult && store.careerQuizResult.topFields.length > 0
        ? `Top field: ${store.careerQuizResult.topFields[0].field} (${store.careerQuizResult.topFields[0].matchPercentage}%)`
        : undefined,
    },
  ];

  const completedCount = assessments.filter(a => a.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Scientific Assessments"
        subtitle="Discover your career personality through validated psychological assessments"
      />

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="group relative rounded-2xl border border-[#f0f0f0] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#e0e0e0] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
          >
            {/* Icon & Status */}
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${assessment.bgColor} ${assessment.color}`}>
                <assessment.icon className="h-5 w-5" />
              </div>
              {assessment.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="h-3 w-3" /> Done
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f5] px-2.5 py-1 text-xs font-medium text-[#737373] border border-[#ebebeb]">
                  <Circle className="h-3 w-3" /> Not Started
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="text-base font-bold text-[#0a0a0a] mb-1.5 tracking-tight">{assessment.name}</h3>
            <p className="text-xs text-[#737373] mb-4 line-clamp-3 leading-relaxed">{assessment.description}</p>

            {/* Meta Info */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs text-[#737373]">
                <BookOpen className="h-3.5 w-3.5 text-[#b0b0b0]" />
                <span className="line-clamp-1">{assessment.theory}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#737373]">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span>{assessment.accuracy}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#737373]">
                <Clock className="h-3.5 w-3.5 text-[#b0b0b0]" />
                <span>{assessment.timeRequired} &middot; {assessment.numQuestions} questions</span>
              </div>
            </div>

            {/* Result Preview */}
            {assessment.resultPreview && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-xs font-medium text-emerald-700">{assessment.resultPreview}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => store.navigateTo(assessment.section)}
                className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-medium transition-all ${
                  assessment.status === 'completed'
                    ? 'bg-[#f5f5f5] text-[#0c0c1d] hover:bg-[#ebebeb] border border-[#ebebeb]'
                    : 'bg-[#0c0c1d] text-white hover:bg-[#1a1a2e]'
                }`}
              >
                {assessment.status === 'completed' ? (
                  <>View Results <ArrowRight className="h-3.5 w-3.5" /></>
                ) : (
                  <>Start <ArrowRight className="h-3.5 w-3.5" /></>
                )}
              </button>
              <button
                onClick={() => setSelectedTheory(assessment.id)}
                className="flex items-center justify-center gap-1 rounded-xl border border-[#ebebeb] px-3 py-2.5 text-sm font-medium text-[#737373] hover:bg-[#f5f5f5] hover:border-[#d4d4d4] transition-all"
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Theory</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assessment Summary */}
      {completedCount > 0 && (
        <div className="ai-card">
          <h3 className="text-sm font-semibold text-[#0a0a0a] mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0c0c1d]" />
            Your Assessment Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {store.riasecResult && (
              <div className="p-3 rounded-xl bg-[#f5f5f5] border border-[#ebebeb]">
                <div className="text-xs font-semibold text-[#0c0c1d] mb-1">RIASEC</div>
                <div className="text-lg font-bold text-[#0a0a0a] tracking-tight">{store.riasecResult.topTwoCode}</div>
                <div className="text-xs text-[#737373]">Top: {store.riasecResult.topCode}</div>
              </div>
            )}
            {store.mbtiResult && (
              <div className="p-3 rounded-xl bg-[#f5f0e6] border border-[#e5dcc8]">
                <div className="text-xs font-semibold text-[#b8965a] mb-1">MBTI</div>
                <div className="text-lg font-bold text-[#0a0a0a] tracking-tight">{store.mbtiResult.type}</div>
                <div className="text-xs text-[#737373]">Personality type</div>
              </div>
            )}
            {store.careerQuizResult && store.careerQuizResult.topFields.length > 0 && (
              <div className="p-3 rounded-xl bg-[#f5f5f5] border border-[#ebebeb]">
                <div className="text-xs font-semibold text-[#4a4a4a] mb-1">Career Field</div>
                <div className="text-lg font-bold text-[#0a0a0a] tracking-tight">{store.careerQuizResult.topFields[0].field}</div>
                <div className="text-xs text-[#737373]">{store.careerQuizResult.topFields[0].matchPercentage}% match</div>
              </div>
            )}
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-[#737373]">
              {completedCount}/3 assessments completed
              {completedCount < 3 && ' — complete all three for a comprehensive AI analysis'}
            </p>
          </div>
        </div>
      )}

      {/* Theory Dialog */}
      <Dialog open={!!selectedTheory} onOpenChange={(open) => !open && setSelectedTheory(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight">
              {selectedTheory === 'riasec' ? 'RIASEC Theory' :
               selectedTheory === 'mbti' ? 'MBTI Theory' : 'Career Field Quiz Theory'}
            </DialogTitle>
          </DialogHeader>
          {selectedTheory && assessmentTheoryDetails[selectedTheory] && (
            <div className="space-y-4 mt-2">
              <div>
                <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-[#0c0c1d]" /> Scientific Theory
                </h4>
                <p className="text-sm text-[#4a4a4a]">{assessmentTheoryDetails[selectedTheory].theory}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1 flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-[#b8965a]" /> Methodology
                </h4>
                <p className="text-sm text-[#4a4a4a]">{assessmentTheoryDetails[selectedTheory].methodology}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-500" /> What It Measures
                </h4>
                <p className="text-sm text-[#4a4a4a]">{assessmentTheoryDetails[selectedTheory].measures}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-[#b8965a]" /> Sample Question
                </h4>
                <div className="p-3 rounded-xl bg-[#f5f5f5] text-sm text-[#4a4a4a] italic border border-[#ebebeb]">
                  {assessmentTheoryDetails[selectedTheory].sampleQuestion}
                </div>
              </div>
              <button
                onClick={() => {
                  const section = selectedTheory === 'riasec' ? 'riasec' as const :
                                  selectedTheory === 'mbti' ? 'mbti' as const : 'career-quiz' as const;
                  store.navigateTo(section);
                  setSelectedTheory(null);
                }}
                className="premium-btn w-full"
              >
                Start Assessment <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
