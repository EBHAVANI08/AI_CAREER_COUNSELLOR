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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700">
            ✨ Let&apos;s get started
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || 'there'}!
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Tell us where you are in your journey so we can personalize your career guidance experience.
          </p>
        </div>

        {/* Country Selection */}
        <div className="rounded-2xl border-2 border-violet-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Select Your Country</h3>
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
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            <option value="">Choose your country...</option>
            {countries.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          {selectedCountry && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
              <span className="text-sm">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-green-700">
                Recommendations will be tailored for {selectedCountry.name}
              </span>
            </div>
          )}
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* School Student Card */}
          <button
            onClick={() => handleSelect('school')}
            className="group relative flex flex-col items-center text-center rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">School Student</h3>
            <p className="text-sm text-gray-500 mb-4">
              Preparing for entrance exams like JEE, NEET, or exploring career options after Class 10/12
            </p>
            <div className="flex items-center gap-1 text-sm font-semibold text-violet-600 group-hover:gap-2 transition-all">
              Get Started <ArrowRight className="h-4 w-4" />
            </div>
          </button>

          {/* College Graduate Card */}
          <button
            onClick={() => handleSelect('college')}
            className="group relative flex flex-col items-center text-center rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
              <Briefcase className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">College Graduate</h3>
            <p className="text-sm text-gray-500 mb-4">
              Looking for jobs, switching careers, or aiming for growth in the job market
            </p>
            <div className="flex items-center gap-1 text-sm font-semibold text-violet-600 group-hover:gap-2 transition-all">
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
