'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { GraduationCap, Briefcase, ArrowRight, Globe } from 'lucide-react';
import { countries } from '@/lib/ai/knowledge';

export default function OnboardingPage() {
  const { user, setUserType, completeOnboarding, setCountry, country, countryName } = useStore();
  const selectedCountry = countries.find(c => c.code === country);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSelect = async (type: 'school' | 'college') => {
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType: type, onboardingComplete: true, country, countryName }),
      });
      if (!response.ok) throw new Error('Unable to save onboarding');
      setUserType(type);
      completeOnboarding();
    } catch {
      setError('Unable to save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="h-1 w-10 rounded-full bg-[#b8965a] mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a]">
            Welcome, {user?.name || 'there'}
          </h1>
          <p className="text-[#737373] max-w-md mx-auto">
            Tell us where you are in your journey so we can personalize your career guidance experience.
          </p>
        </div>

        {/* Country Selection */}
        <div className="rounded-2xl border border-[#f0f0f0] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f5f5] text-[#0c0c1d]">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0a0a0a]">Select Your Country</h3>
              <p className="text-xs text-[#737373]">We&apos;ll tailor recommendations to your country</p>
            </div>
          </div>
          <select
            value={country}
            onChange={(e) => {
              const selected = countries.find(c => c.code === e.target.value);
              if (selected) {
                setCountry(selected.code, selected.name);
              }
            }}
            className="premium-input"
          >
            <option value="">Choose your country...</option>
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          {selectedCountry && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#f5f0e6] border border-[#e5dcc8] px-3 py-2">
              <span className="text-sm">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-[#b8965a]">
                Recommendations will be tailored for {selectedCountry.name}
              </span>
            </div>
          )}
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* School Student Card */}
          <button
            onClick={() => handleSelect('school')}
            disabled={saving}
            className="group relative flex flex-col items-center text-center rounded-2xl border border-[#f0f0f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#d4d4d4] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#0c0c1d] transition-colors group-hover:bg-[#0c0c1d] group-hover:text-white">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0a0a0a] mb-2 tracking-tight">School Student</h3>
            <p className="text-sm text-[#737373] mb-4 leading-relaxed">
              Preparing for entrance exams or exploring career options after Class 10/12
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-[#0c0c1d] group-hover:gap-2 transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
            </div>
          </button>

          {/* College Graduate Card */}
          <button
            onClick={() => handleSelect('college')}
            disabled={saving}
            className="group relative flex flex-col items-center text-center rounded-2xl border border-[#f0f0f0] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#d4d4d4] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#f5f5f5] text-[#0c0c1d] transition-colors group-hover:bg-[#0c0c1d] group-hover:text-white">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-[#0a0a0a] mb-2 tracking-tight">College Graduate</h3>
            <p className="text-sm text-[#737373] mb-4 leading-relaxed">
              Looking for jobs, switching careers, or aiming for growth in the job market
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-[#0c0c1d] group-hover:gap-2 transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        <p className="text-center text-xs text-[#b0b0b0]">
          You can change your country and type later in your profile settings
        </p>
      </div>
    </div>
  );
}
