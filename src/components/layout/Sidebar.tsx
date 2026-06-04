'use client';

import { useStore } from '@/lib/store';
import {
  LayoutDashboard, ClipboardList, MessageSquare, Map,
  Compass, FileText, User,
} from 'lucide-react';
import type { AppSection } from '@/types';

const navItems: { section: AppSection; label: string; icon: any }[] = [
  { section: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'assessments', label: 'Assessments', icon: ClipboardList },
  { section: 'chat', label: 'AI Coach', icon: MessageSquare },
  { section: 'career-path', label: 'Career Path', icon: Map },
  { section: 'discover', label: 'Discover', icon: Compass },
  { section: 'resume', label: 'Resume', icon: FileText },
  { section: 'profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { currentSection, navigateTo, logout, user, countryName } = useStore();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2.5 p-6 border-b border-gray-100">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold text-gray-900">CareerAI</span>
          <span className="block text-xs text-gray-400">Career Guidance</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{countryName || user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentSection === item.section ||
            (item.section === 'assessments' && ['riasec', 'mbti', 'career-quiz'].includes(currentSection));
          return (
            <button
              key={item.section}
              onClick={() => navigateTo(item.section)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-violet-100 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-violet-600' : 'text-gray-400'}`} />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
