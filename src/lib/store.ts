// ===== Zustand Store — Full State Management =====
import { create } from 'zustand';
import type { AppSection, UserProfile, RIASECResult, MBTIResult, CareerQuizResult, CareerPathStep, ChatMessage, AIRoutingResult, AssessmentAnalysis, SuggestedAction } from '@/types';

interface AppState {
  // Auth
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;

  // Onboarding
  userType: 'school' | 'college' | null;
  onboardingComplete: boolean;
  setUserType: (type: 'school' | 'college') => void;
  completeOnboarding: () => void;

  // Country
  country: string;
  countryName: string;
  setCountry: (code: string, name: string) => void;

  // Navigation
  currentSection: AppSection;
  previousSection: AppSection;
  navigateTo: (section: AppSection) => void;
  goBack: () => void;

  // Assessments
  riasecResult: RIASECResult | null;
  setRiasecResult: (result: RIASECResult) => void;
  mbtiResult: MBTIResult | null;
  setMbtiResult: (result: MBTIResult) => void;
  careerQuizResult: CareerQuizResult | null;
  setCareerQuizResult: (result: CareerQuizResult) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  chatLoading: boolean;
  setChatLoading: (loading: boolean) => void;

  // Career Path
  careerPath: CareerPathStep[];
  setCareerPath: (steps: CareerPathStep[]) => void;
  toggleStepComplete: (id: string) => void;

  // Resume
  resumeContent: string;
  setResumeContent: (content: string) => void;

  // Profile
  skills: string[];
  setSkills: (skills: string[]) => void;
  interests: string[];
  setInterests: (interests: string[]) => void;
  education: string;
  setEducation: (education: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;

  // AI
  aiRouting: AIRoutingResult | null;
  setAIRouting: (routing: AIRoutingResult) => void;
  assessmentAnalysis: AssessmentAnalysis | null;
  setAssessmentAnalysis: (analysis: AssessmentAnalysis) => void;

  // Computed
  profileCompleteness: () => number;
  completedAssessmentCount: () => number;

  // Hydration
  _hydrated: boolean;
  _setHydrated: () => void;
}

const STORAGE_PREFIX = 'aic_';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: (email, name) => {
    const user = { email, name };
    set({ user, isAuthenticated: true });
    saveToStorage('user', user);
    saveToStorage('isAuthenticated', true);
  },
  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      onboardingComplete: false,
      userType: null,
      country: '',
      countryName: '',
      currentSection: 'landing',
      previousSection: 'landing',
      chatMessages: [],
      careerPath: [],
      resumeContent: '',
      riasecResult: null,
      mbtiResult: null,
      careerQuizResult: null,
      aiRouting: null,
      assessmentAnalysis: null,
      skills: [],
      interests: [],
      education: '',
      targetRole: '',
    });
    // Clear all prefixed localStorage keys
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) keysToRemove.push(key);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
  },

  // Onboarding
  userType: null,
  onboardingComplete: false,
  setUserType: (type) => {
    set({ userType: type });
    saveToStorage('userType', type);
  },
  completeOnboarding: () => {
    set({ onboardingComplete: true, currentSection: 'dashboard' });
    saveToStorage('onboardingComplete', true);
  },

  // Country
  country: '',
  countryName: '',
  setCountry: (code, name) => {
    set({ country: code, countryName: name });
    saveToStorage('country', code);
    saveToStorage('countryName', name);
  },

  // Navigation
  currentSection: 'landing',
  previousSection: 'landing',
  navigateTo: (section) => {
    const current = get().currentSection;
    set({ currentSection: section, previousSection: current });
    saveToStorage('currentSection', section);
    saveToStorage('previousSection', current);
  },
  goBack: () => {
    const prev = get().previousSection;
    const current = get().currentSection;
    set({ currentSection: prev, previousSection: current });
    saveToStorage('currentSection', prev);
    saveToStorage('previousSection', current);
  },

  // Assessments
  riasecResult: null,
  setRiasecResult: (result) => {
    set({ riasecResult: result });
    saveToStorage('riasecResult', result);
  },
  mbtiResult: null,
  setMbtiResult: (result) => {
    set({ mbtiResult: result });
    saveToStorage('mbtiResult', result);
  },
  careerQuizResult: null,
  setCareerQuizResult: (result) => {
    set({ careerQuizResult: result });
    saveToStorage('careerQuizResult', result);
  },

  // Chat
  chatMessages: [],
  addChatMessage: (message) => {
    const messages = [...get().chatMessages, message];
    set({ chatMessages: messages });
    saveToStorage('chatMessages', messages);
  },
  clearChat: () => {
    set({ chatMessages: [] });
    saveToStorage('chatMessages', []);
  },
  chatLoading: false,
  setChatLoading: (loading) => set({ chatLoading: loading }),

  // Career Path
  careerPath: [],
  setCareerPath: (steps) => {
    set({ careerPath: steps });
    saveToStorage('careerPath', steps);
  },
  toggleStepComplete: (id) => {
    const steps = get().careerPath.map(s =>
      s.id === id ? { ...s, completed: !s.completed } : s
    );
    set({ careerPath: steps });
    saveToStorage('careerPath', steps);
  },

  // Resume
  resumeContent: '',
  setResumeContent: (content) => {
    set({ resumeContent: content });
    saveToStorage('resumeContent', content);
  },

  // Profile
  skills: [],
  setSkills: (skills) => {
    set({ skills });
    saveToStorage('skills', skills);
  },
  interests: [],
  setInterests: (interests) => {
    set({ interests });
    saveToStorage('interests', interests);
  },
  education: '',
  setEducation: (education) => {
    set({ education });
    saveToStorage('education', education);
  },
  targetRole: '',
  setTargetRole: (role) => {
    set({ targetRole: role });
    saveToStorage('targetRole', role);
  },

  // AI
  aiRouting: null,
  setAIRouting: (routing) => {
    set({ aiRouting: routing });
    saveToStorage('aiRouting', routing);
  },
  assessmentAnalysis: null,
  setAssessmentAnalysis: (analysis) => {
    set({ assessmentAnalysis: analysis });
    saveToStorage('assessmentAnalysis', analysis);
  },

  // Computed
  profileCompleteness: () => {
    const state = get();
    let score = 0;
    const total = 12;

    if (state.user?.name) score++;
    if (state.user?.email) score++;
    if (state.country) score++;
    if (state.education) score++;
    if (state.skills.length > 0) score++;
    if (state.interests.length > 0) score++;
    if (state.targetRole) score++;
    if (state.riasecResult) score++;
    if (state.mbtiResult) score++;
    if (state.careerQuizResult) score++;
    if (state.onboardingComplete) score++;
    if (state.userType) score++;

    return Math.round((score / total) * 100);
  },

  completedAssessmentCount: () => {
    const state = get();
    let count = 0;
    if (state.riasecResult) count++;
    if (state.mbtiResult) count++;
    if (state.careerQuizResult) count++;
    return count;
  },

  // Hydration
  _hydrated: false,
  _setHydrated: () => set({ _hydrated: true }),
}));

// Hydrate store from localStorage on client mount
if (typeof window !== 'undefined') {
  const hydrate = () => {
    const state = useStore.getState();
    if (state._hydrated) return;

    useStore.setState({
      user: loadFromStorage('user', null),
      isAuthenticated: loadFromStorage('isAuthenticated', false),
      userType: loadFromStorage('userType', null),
      onboardingComplete: loadFromStorage('onboardingComplete', false),
      country: loadFromStorage('country', ''),
      countryName: loadFromStorage('countryName', ''),
      currentSection: loadFromStorage<AppSection>('currentSection', 'landing'),
      previousSection: loadFromStorage<AppSection>('previousSection', 'landing'),
      riasecResult: loadFromStorage('riasecResult', null),
      mbtiResult: loadFromStorage('mbtiResult', null),
      careerQuizResult: loadFromStorage('careerQuizResult', null),
      chatMessages: loadFromStorage('chatMessages', []),
      careerPath: loadFromStorage('careerPath', []),
      resumeContent: loadFromStorage('resumeContent', ''),
      skills: loadFromStorage('skills', []),
      interests: loadFromStorage('interests', []),
      education: loadFromStorage('education', ''),
      targetRole: loadFromStorage('targetRole', ''),
      aiRouting: loadFromStorage('aiRouting', null),
      assessmentAnalysis: loadFromStorage('assessmentAnalysis', null),
      _hydrated: true,
    });
  };

  // Run hydration after a tick to ensure client-side
  setTimeout(hydrate, 0);
}
