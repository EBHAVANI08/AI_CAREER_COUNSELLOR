'use client';

import { useStore } from '@/lib/store';
import type { AppSection } from '@/types';
import { Home, ClipboardList, MessageSquare, Map, Compass } from 'lucide-react';

const navItems: { section: AppSection; label: string; icon: any }[] = [
  { section: 'dashboard', label: 'Home', icon: Home },
  { section: 'assessments', label: 'Assess', icon: ClipboardList },
  { section: 'chat', label: 'Chat', icon: MessageSquare },
  { section: 'discover', label: 'Discover', icon: Compass },
  { section: 'career-path', label: 'Career', icon: Map },
];

export default function MobileNav() {
  const { currentSection, navigateTo } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = currentSection === item.section ||
            (item.section === 'assessments' && ['riasec', 'mbti', 'career-quiz'].includes(currentSection));

          return (
            <button
              key={item.section}
              onClick={() => navigateTo(item.section)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all ${
                isActive ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-indigo-500" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
