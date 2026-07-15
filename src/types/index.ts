// ===== AI Career Counsellor — Shared Types =====

export type AppSection =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'assessments'
  | 'riasec'
  | 'mbti'
  | 'career-quiz'
  | 'chat'
  | 'career-path'
  | 'resume'
  | 'discover'
  | 'profile';

export interface UserProfile {
  name: string;
  email: string;
  userType: 'school' | 'college' | null;
  onboardingComplete: boolean;
  country: string;
  countryName: string;
  riasecResult: RIASECResult | null;
  mbtiResult: MBTIResult | null;
  careerQuizResult: CareerQuizResult | null;
  skills: string[];
  interests: string[];
  education: string;
  targetRole: string;
}

export interface RIASECResult {
  scores: {
    R: number; // Realistic
    I: number; // Investigative
    A: number; // Artistic
    S: number; // Social
    E: number; // Enterprising
    C: number; // Conventional
  };
  topCode: string;
  topTwoCode: string;
  completedAt: string;
}

export interface MBTIResult {
  dimensions: {
    E: number; I: number; // Extraversion / Introversion
    S: number; N: number; // Sensing / Intuition
    T: number; F: number; // Thinking / Feeling
    J: number; P: number; // Judging / Perceiving
  };
  type: string; // e.g. "INTJ"
  completedAt: string;
}

export interface CareerQuizResult {
  fieldScores: Record<string, number>;
  topFields: { field: string; score: number; matchPercentage: number }[];
  completedAt: string;
}

export interface CareerPathStep {
  id: string;
  title: string;
  description: string;
  timeline: string;
  skills: string[];
  milestones: string[];
  resources: string[];
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: SuggestedAction[];
  agentUsed?: string;
}

export interface SuggestedAction {
  id: string;
  label: string;
  section: AppSection;
  description?: string;
}

export interface AIRoutingResult {
  primaryPath: string;
  secondaryPath: string;
  confidence: number;
  reasoning: string;
  recommendedActions: SuggestedAction[];
}

export interface AssessmentAnalysis {
  summary: string;
  strengths: string[];
  careerMatches: string[];
  skillGaps: string[];
  recommendations: string[];
  crossAssessmentInsights: string[];
}

// ===== New Types for Discover Section =====

export interface UniqueCourse {
  id: string;
  name: string;
  field: string;
  description: string;
  whyUnique: string;
  skills: string[];
  careerOutcomes: { role: string; salaryRange: string }[];
  salaryRange: { entry: string; mid: string; senior: string };
  growthPotential: string;
  countries: string[];
  similarCourses: string[];
}

export interface Institution {
  id: string;
  name: string;
  type: 'university' | 'college' | 'institute' | 'polytechnic' | 'training_center';
  location: {
    city: string;
    state: string;
    country: string;
    tier: 'metro' | 'tier-1' | 'tier-2' | 'tier-3' | 'village';
  };
  ranking: {
    national: number | null;
    state: number | null;
  };
  courses: string[];
  fees: {
    tuition: string;
    hostel: string | null;
    application: string;
  };
  placementRate: number | null;
  avgPlacementSalary: string | null;
  topRecruiters: string[];
  startDate: string;
  url: string;
  accreditation: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend: string;
  applyBy: string;
  skills: string[];
  field: string;
  url: string;
  country: string;
  description: string;
}

export interface GovtCourse {
  id: string;
  name: string;
  provider: string;
  duration: string;
  cost: string;
  eligibility: string;
  certification: string;
  url: string;
  country: string;
  description: string;
  skills: string[];
}

export interface ShortCourse {
  id: string;
  name: string;
  provider: string;
  duration: string;
  cost: string;
  skills: string[];
  mode: 'online' | 'offline' | 'hybrid';
  field: string;
  url: string;
  country: string;
  description: string;
}
