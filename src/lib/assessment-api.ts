export type PersistedAssessmentType = 'RIASEC' | 'MBTI' | 'CAREER_QUIZ';

export async function persistAssessmentAttempt(
  type: PersistedAssessmentType,
  result: object,
  questionOrder: number[],
) {
  const response = await fetch('/api/assessments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, result, questionOrder }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Unable to save assessment attempt');
  }

  return response.json();
}
