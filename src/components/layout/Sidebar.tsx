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
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-[#fafafa] border-r border-[#f0f0f0]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#f0f0f0]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0c0c1d]">
          <LayoutDashboard className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-[#0a0a0a] tracking-tight">CareerAI</span>
        </div>
      </div>

      {/* Subtle gold accent line */}
      <div className="h-0.5 bg-[#b8965a]/30 mx-5" />

      {/* User Info */}
      <div className="px-4 py-3 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f5f5] text-sm font-semibold text-[#0c0c1d]">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#0a0a0a] truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-[#b0b0b0] truncate">{countryName || user?.email || ''}</p>
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
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-[#f0f0f0] text-[#0c0c1d]'
                  : 'text-[#737373] hover:bg-[#f5f5f5] hover:text-[#0a0a0a]'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-[#0c0c1d]" />
              )}
              <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-[#0c0c1d]' : 'text-[#b0b0b0]'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-[#f0f0f0] p-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#b0b0b0] hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
