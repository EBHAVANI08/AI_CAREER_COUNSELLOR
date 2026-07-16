'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Brain, Sparkles, Map, FileText, Eye, EyeOff, Loader2, Zap } from 'lucide-react';

export default function LandingPage() {
  const { login, navigateTo } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required'); return; }
    if (isSignUp && !name.trim()) { setError('Name is required'); return; }
    if (!password.trim() || password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      const response = await fetch(isSignUp ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(isSignUp ? { name } : {}) }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to continue');
        return;
      }
      login(data.user.email, data.user.name);
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Brain, title: 'AI-Powered Guidance', desc: '6 specialized AI agents analyze your unique profile for personalized career advice' },
    { icon: Sparkles, title: 'Scientific Assessments', desc: 'RIASEC, MBTI & Career Quiz — industry-standard tools to discover your strengths' },
    { icon: Map, title: 'Career Roadmaps', desc: 'Step-by-step career paths with market data, resources & timelines' },
    { icon: FileText, title: 'Resume Builder', desc: 'ATS-optimized resumes tailored for the job market' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Hero */}
      <div className="hidden lg:flex lg:w-1/2 ai-gradient flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">CareerAI</span>
          </div>
          <div className="mt-3">
            <span className="ai-badge bg-[#b8965a]/20 text-[#d4b87a] border border-[#b8965a]/20 text-xs">
              <Sparkles className="h-3 w-3" /> Powered by Multi-Agent AI
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <div className="h-1 w-10 rounded-full bg-[#b8965a]/60 mb-6" />
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Discover Your<br />
              Dream Career
            </h1>
          </div>
          <p className="text-base text-white/70 max-w-md leading-relaxed">
            Intelligent career guidance powered by AI. Built for students and professionals seeking clarity in their career journey.
          </p>

          <div className="space-y-3 mt-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3.5 rounded-xl bg-white/8 backdrop-blur-sm p-4 transition-all hover:bg-white/12 border border-white/10">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/12">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/40">
          &copy; 2025 CareerAI — Intelligent Career Guidance
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0c0c1d]">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#0a0a0a] tracking-tight">CareerAI</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a]">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm text-[#737373]">
              {isSignUp
                ? 'Start your journey to a fulfilling career'
                : 'Sign in to continue your career journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#4a4a4a] mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="premium-input"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#4a4a4a] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#4a4a4a] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="premium-input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0b0b0] hover:text-[#737373]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="premium-btn w-full py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-sm text-[#0c0c1d] hover:text-[#1a1a2e] font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden space-y-3 pt-4 border-t border-[#f0f0f0]">
            {features.slice(0, 2).map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-[#4a4a4a]">
                <f.icon className="h-4 w-4 text-[#0c0c1d] shrink-0" />
                <span>{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
