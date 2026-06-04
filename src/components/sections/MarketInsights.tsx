'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { careerFields, inDemandSkills, topInstitutions, entranceExams, learningPlatforms } from '@/lib/ai/knowledge';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Building2, GraduationCap, BookOpen, ExternalLink, Award, Loader2 } from 'lucide-react';

export default function MarketInsights() {
  const { navigateTo } = useStore();
  const [activeTab, setActiveTab] = useState<'careers' | 'skills' | 'institutions' | 'exams' | 'platforms'>('careers');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try fetching from API first, fall back to local data
    const loadData = async () => {
      try {
        const res = await fetch('/api/insights');
        if (res.ok) {
          const apiData = await res.json();
          setData(apiData);
        } else {
          setData({ careerFields, inDemandSkills, topInstitutions, entranceExams, learningPlatforms });
        }
      } catch {
        setData({ careerFields, inDemandSkills, topInstitutions, entranceExams, learningPlatforms });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const d = data || { careerFields, inDemandSkills, topInstitutions, entranceExams, learningPlatforms };

  const tabs = [
    { key: 'careers', label: 'Careers', icon: TrendingUp },
    { key: 'skills', label: 'Skills', icon: Award },
    { key: 'institutions', label: 'Institutions', icon: Building2 },
    { key: 'exams', label: 'Exams', icon: GraduationCap },
    { key: 'platforms', label: 'Learn', icon: BookOpen },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="section-title">Market Insights</h1>
      </div>

      <p className="section-subtitle">Job market intelligence for informed career decisions</p>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2 border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'careers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(d.careerFields).map(([key, field]: [string, any]) => (
            <div key={key} className="card-hover">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">{field.name}</h3>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <TrendingUp className="h-3 w-3" /> {field.growthPercent}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Demand: {field.demandLevel}</p>

              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500">Salary Ranges:</span>
                <div className="mt-1 text-xs text-gray-600 space-y-0.5">
                  <div>Entry: {field.salaryRanges.entry}</div>
                  <div>Mid: {field.salaryRanges.mid}</div>
                  <div>Senior: {field.salaryRanges.senior}</div>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500">Hot Roles:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {field.hotRoles.slice(0, 3).map((role: string) => (
                    <span key={role} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100">{role}</span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500">Top Companies:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {field.topCompanies.slice(0, 4).map((company: string) => (
                    <span key={company} className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-600 border border-gray-100">{company}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="card">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">In-Demand Skills</h3>
          <div className="space-y-2.5">
            {d.inDemandSkills.map((skill: any, i: number) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{skill.category}</span>
                      {skill.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                      ) : skill.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      ) : (
                        <Minus className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 animate-progress"
                      style={{ width: `${skill.demand}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-indigo-600 w-10 text-right">{skill.demand}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'institutions' && (
        <div className="space-y-6">
          {/* Engineering */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-500" /> Engineering Colleges
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">NIRF</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Institute</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Location</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Avg Package</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {d.topInstitutions.engineering.map((inst: any) => (
                    <tr key={inst.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 font-bold text-indigo-600">#{inst.nirf}</td>
                      <td className="py-2 px-3 font-medium text-gray-900">{inst.name}</td>
                      <td className="py-2 px-3 text-gray-500">{inst.location}</td>
                      <td className="py-2 px-3 text-gray-700">{inst.avgPackage}</td>
                      <td className="py-2 px-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          inst.type === 'Government' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>{inst.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Management */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" /> Management Colleges
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">NIRF</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Institute</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Location</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Avg Package</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {d.topInstitutions.management.map((inst: any) => (
                    <tr key={inst.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 font-bold text-blue-600">#{inst.nirf}</td>
                      <td className="py-2 px-3 font-medium text-gray-900">{inst.name}</td>
                      <td className="py-2 px-3 text-gray-500">{inst.location}</td>
                      <td className="py-2 px-3 text-gray-700">{inst.avgPackage}</td>
                      <td className="py-2 px-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          inst.type === 'Government' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>{inst.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Medical */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-500" /> Medical Colleges
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">NIRF</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Institute</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Location</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {d.topInstitutions.medical.map((inst: any) => (
                    <tr key={inst.name} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 font-bold text-emerald-600">#{inst.nirf}</td>
                      <td className="py-2 px-3 font-medium text-gray-900">{inst.name}</td>
                      <td className="py-2 px-3 text-gray-500">{inst.location}</td>
                      <td className="py-2 px-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          inst.type === 'Government' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>{inst.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="space-y-6">
          {Object.entries(d.entranceExams).map(([category, exams]: [string, any]) => {
            const categoryNames: Record<string, string> = {
              engineering: 'Engineering',
              medical: 'Medical',
              management: 'Management',
              law: 'Law',
              design: 'Design',
              civilServices: 'Civil Services',
              general: 'General',
            };
            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{categoryNames[category] || category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exams.map((exam: any) => (
                    <div key={exam.name} className="card-hover p-4">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-semibold text-gray-900">{exam.name}</h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{exam.frequency}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{exam.fullForm}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700 border border-indigo-100">{exam.conductingBody}</span>
                        <span className="text-gray-400">&middot;</span>
                        <span className="text-gray-500">{exam.eligibility}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'platforms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {d.learningPlatforms.map((platform: any) => (
            <div key={platform.name} className="card-hover">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">{platform.name}</h3>
                <div className="flex gap-1">
                  {platform.indianContent && (
                    <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-xs text-amber-700 border border-amber-100">IN</span>
                  )}
                  {platform.free && (
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700 border border-emerald-100">Free</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{platform.description}</p>
              <div className="flex flex-wrap gap-1">
                {platform.focus.map((f: string) => (
                  <span key={f} className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-600 border border-gray-100">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
