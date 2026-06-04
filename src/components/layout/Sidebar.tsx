'use client';

import { useStore } from '@/lib/store';
import {
  LayoutDashboard, ClipboardList, MessageSquare, Map,
  Compass, FileText, User, LogOut,
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
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
          <LayoutDashboard className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-gray-900 tracking-tight">CareerAI</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{countryName || user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = currentSection === item.section ||
            (item.section === 'assessments' && ['riasec', 'mbti', 'career-quiz'].includes(currentSection));
          return (
            <button
              key={item.section}
              onClick={() => navigateTo(item.section)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-indigo-500" />
              )}
              <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
