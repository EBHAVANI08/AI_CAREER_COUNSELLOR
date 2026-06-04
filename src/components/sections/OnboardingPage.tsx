'use client';

import { useStore } from '@/lib/store';
import { GraduationCap, Briefcase, ArrowRight, Globe } from 'lucide-react';
import { countries } from '@/lib/ai/knowledge';

export default function OnboardingPage() {
  const { user, setUserType, completeOnboarding, setCountry, country, countryName } = useStore();
  const selectedCountry = countries.find(c => c.code === country);

  const handleSelect = (type: 'school' | 'college') => {
    setUserType(type);
    completeOnboarding();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="h-1 w-10 rounded-full bg-indigo-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome, {user?.name || 'there'}
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Tell us where you are in your journey so we can personalize your career guidance experience.
          </p>
        </div>

        {/* Country Selection */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Select Your Country</h3>
              <p className="text-xs text-gray-500">We&apos;ll tailor recommendations to your country</p>
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
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
              <span className="text-sm">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-emerald-700">
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
            className="group relative flex flex-col items-center text-center rounded-xl border border-gray-200/80 bg-white p-8 shadow-xs transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">School Student</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Preparing for entrance exams or exploring career options after Class 10/12
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-indigo-500 group-hover:gap-2 transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
            </div>
          </button>

          {/* College Graduate Card */}
          <button
            onClick={() => handleSelect('college')}
            className="group relative flex flex-col items-center text-center rounded-xl border border-gray-200/80 bg-white p-8 shadow-xs transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">College Graduate</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Looking for jobs, switching careers, or aiming for growth in the job market
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-indigo-500 group-hover:gap-2 transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">
          You can change your country and type later in your profile settings
        </p>
      </div>
    </div>
  );
}
