'use client';

import { useCallback, useEffect, useState } from 'react';

type QuestionWithId = { id: number };

function shuffledWithoutRepeating<T extends QuestionWithId>(
  questions: readonly T[],
  previousIds: number[],
) {
  const next = [...questions];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  const matchesPrevious =
    next.length > 1 &&
    previousIds.length === next.length &&
    next.every((question, index) => question.id === previousIds[index]);

  if (matchesPrevious) {
    next.push(next.shift()!);
  }

  return next;
}

export function useShuffledAssessment<T extends QuestionWithId>(
  questions: readonly T[],
  assessmentKey: string,
  userKey: string,
) {
  const [orderedQuestions, setOrderedQuestions] = useState<T[]>([...questions]);

  const reshuffle = useCallback(() => {
    const storageKey = `aic_assessment_order_${assessmentKey}_${userKey || 'guest'}`;
    let previousIds: number[] = [];

    try {
      previousIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      previousIds = [];
    }

    const next = shuffledWithoutRepeating(questions, previousIds);
    setOrderedQuestions(next);

    try {
      localStorage.setItem(storageKey, JSON.stringify(next.map(question => question.id)));
    } catch {
      // The assessment still works when browser storage is unavailable.
    }
  }, [assessmentKey, questions, userKey]);

  useEffect(() => {
    const timer = window.setTimeout(reshuffle, 0);
    return () => window.clearTimeout(timer);
  }, [reshuffle]);

  return { questions: orderedQuestions, reshuffle };
}
