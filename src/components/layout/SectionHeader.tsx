'use client';

import { useStore } from '@/lib/store';
import { ArrowLeft } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function SectionHeader({ title, subtitle, showBack = true }: SectionHeaderProps) {
  const { goBack } = useStore();

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm pb-4 -mx-1 px-1">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={goBack}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
