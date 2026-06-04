'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import SectionHeader from '@/components/layout/SectionHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  uniqueCoursesDatabase, internshipDatabase, govtCourseDatabase,
  shortCourseDatabase, getInstitutionsForCourse,
} from '@/lib/ai/knowledge';
import type { UniqueCourse, Institution, Internship, GovtCourse, ShortCourse } from '@/types';
import {
  Sparkles, Building2, GraduationCap, Briefcase, Clock, MapPin,
  DollarSign, TrendingUp, Award, ExternalLink, Users, Star,
  ChevronRight, Loader2, Search, Filter,
} from 'lucide-react';

const fieldAccentColors: Record<string, string> = {
  Technology: 'bg-[#0c0c1d]',
  Law: 'bg-[#b8965a]',
  Science: 'bg-[#0c0c1d]',
  Finance: 'bg-[#b8965a]',
  Engineering: 'bg-[#0c0c1d]',
  Hospitality: 'bg-[#b8965a]',
  Environment: 'bg-[#0c0c1d]',
  Sports: 'bg-[#b8965a]',
  Design: 'bg-[#0c0c1d]',
  Luxury: 'bg-[#b8965a]',
  Agriculture: 'bg-[#0c0c1d]',
  Culture: 'bg-[#b8965a]',
  Media: 'bg-[#0c0c1d]',
  Healthcare: 'bg-[#b8965a]',
  Food: 'bg-[#0c0c1d]',
};

function CourseCard({ course, onClick }: { course: UniqueCourse; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left card-hover"
    >
      <div className="flex items-start gap-3">
        <div className={`w-1 self-stretch rounded-full ${fieldAccentColors[course.field] || 'bg-[#0c0c1d]'} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#0a0a0a] line-clamp-1">{course.name}</h3>
            <ChevronRight className="h-4 w-4 text-[#d4d4d4] shrink-0 group-hover:text-[#0c0c1d] transition-colors" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">{course.field}</Badge>
            <span className="text-xs text-[#b0b0b0]">&middot;</span>
            <span className="text-xs text-[#737373]">{course.growthPotential.split('—')[0].trim()}</span>
          </div>
          <p className="text-xs text-[#737373] mt-1.5 line-clamp-2">{course.whyUnique}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-[#b0b0b0]">
            <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{course.salaryRange.entry}</span>
            <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald-500" />{course.growthPotential.split('—')[1]?.trim() || course.growthPotential}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function CourseDialog({ course, open, onOpenChange }: { course: UniqueCourse | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { country } = useStore();
  if (!course) return null;

  const institutions = getInstitutionsForCourse(course.id, country || undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">{course.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge>{course.field}</Badge>
            <Badge variant="outline" className="text-[#b8965a] border-[#b8965a]/40">
              <TrendingUp className="h-3 w-3 mr-1" />{course.growthPotential}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1">What makes this course unique?</h4>
            <p className="text-sm text-[#4a4a4a]">{course.whyUnique}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1">Full Description</h4>
            <p className="text-sm text-[#4a4a4a]">{course.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-2">Skills You&apos;ll Learn</h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-2">Career Outcomes & Salaries</h4>
            <div className="space-y-2">
              {course.careerOutcomes.map((outcome, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#f5f5f5]">
                  <span className="text-sm text-[#4a4a4a]">{outcome.role}</span>
                  <span className="text-sm font-semibold text-[#0c0c1d]">{outcome.salaryRange}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-2">Salary Progression</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 rounded-xl bg-[#f5f5f5] border border-[#ebebeb]">
                <div className="text-xs text-[#737373]">Entry</div>
                <div className="text-sm font-bold text-[#0a0a0a]">{course.salaryRange.entry}</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-[#f5f5f5] border border-[#ebebeb]">
                <div className="text-xs text-[#737373]">Mid</div>
                <div className="text-sm font-bold text-[#0a0a0a]">{course.salaryRange.mid}</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-[#f5f0e6] border border-[#e5dcc8]">
                <div className="text-xs text-[#737373]">Senior</div>
                <div className="text-sm font-bold text-[#b8965a]">{course.salaryRange.senior}</div>
              </div>
            </div>
          </div>

          {institutions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#0a0a0a] mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0c0c1d]" />
                Institutions Offering This Course
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {institutions.map(inst => (
                  <InstitutionCard key={inst.id} institution={inst} compact />
                ))}
              </div>
            </div>
          )}

          {course.similarCourses.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-[#0a0a0a] mb-2">Similar Courses</h4>
              <div className="flex flex-wrap gap-1.5">
                {course.similarCourses.map(id => {
                  const similar = uniqueCoursesDatabase.find(c => c.id === id);
                  return similar ? (
                    <Badge key={id} variant="outline" className="text-xs">{similar.name}</Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InstitutionCard({ institution, compact = false, onClick }: { institution: Institution; compact?: boolean; onClick?: () => void }) {
  const getRankBadge = (rank: number | null) => {
    if (!rank) return null;
    if (rank <= 10) return <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f0e6] px-2 py-0.5 text-xs font-bold text-[#b8965a] border border-[#e5dcc8]"><Star className="h-3 w-3" />#{rank}</span>;
    if (rank <= 25) return <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs font-bold text-[#4a4a4a] border border-[#ebebeb]">#{rank}</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-[#f5f5f5] px-2 py-0.5 text-xs font-bold text-[#0a0a0a] border border-[#ebebeb]">#{rank}</span>;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2.5 rounded-xl border border-[#ebebeb] bg-white hover:border-[#d4d4d4] transition-all">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#0a0a0a] truncate">{institution.name}</span>
            {getRankBadge(institution.ranking.national)}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#b0b0b0]">
            <MapPin className="h-3 w-3" />
            <span>{institution.location.city}, {institution.location.state}</span>
            <span>&middot;</span>
            <span>{institution.fees.tuition}</span>
          </div>
        </div>
        {institution.placementRate && (
          <div className="text-right shrink-0">
            <div className="text-xs text-[#737373]">Placement</div>
            <div className="text-sm font-bold text-emerald-600">{institution.placementRate}%</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-2xl border border-[#f0f0f0] bg-white hover:border-[#e0e0e0] hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-[#0a0a0a]">{institution.name}</h4>
        {getRankBadge(institution.ranking.national)}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-[#737373]">
          <MapPin className="h-3 w-3" />
          <span>{institution.location.city}, {institution.location.state}</span>
          <Badge variant="outline" className="text-xs py-0">{institution.type}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-[#737373]"><DollarSign className="h-3 w-3" /> Tuition: {institution.fees.tuition}</div>
          {institution.fees.hostel && <div className="flex items-center gap-1 text-[#737373]">Hostel: {institution.fees.hostel}</div>}
          {institution.placementRate && <div className="flex items-center gap-1 text-emerald-600"><TrendingUp className="h-3 w-3" /> {institution.placementRate}% placed</div>}
          {institution.avgPlacementSalary && <div className="flex items-center gap-1 text-[#0c0c1d]"><Award className="h-3 w-3" /> {institution.avgPlacementSalary}</div>}
        </div>
        {institution.topRecruiters.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {institution.topRecruiters.slice(0, 4).map(r => (
              <span key={r} className="rounded bg-[#f5f5f5] px-1.5 py-0.5 text-xs text-[#4a4a4a] border border-[#ebebeb]">{r}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[#b0b0b0]">{institution.accreditation}</span>
          <span className="text-xs text-[#b0b0b0]">Next: {institution.startDate}</span>
        </div>
      </div>
    </button>
  );
}

function InstitutionDialog({ institution, open, onOpenChange }: { institution: Institution | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!institution) return null;

  const courseNames = institution.courses.map(cid => {
    const c = uniqueCoursesDatabase.find(uc => uc.id === cid);
    return c ? c.name : cid;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">{institution.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="flex flex-wrap gap-2">
            <Badge>{institution.type}</Badge>
            <Badge variant="outline">{institution.accreditation}</Badge>
            {institution.ranking.national && <Badge variant="secondary" className="bg-[#f5f0e6] text-[#b8965a] border border-[#e5dcc8]">National Rank #{institution.ranking.national}</Badge>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#f5f5f5] border border-[#ebebeb]">
              <div className="text-xs text-[#737373] mb-1">Location</div>
              <div className="text-sm font-medium text-[#0a0a0a]">{institution.location.city}, {institution.location.state}</div>
              <div className="text-xs text-[#b0b0b0]">{institution.location.tier} area</div>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f5f5] border border-[#ebebeb]">
              <div className="text-xs text-[#737373] mb-1">Tuition Fee</div>
              <div className="text-sm font-bold text-[#0c0c1d]">{institution.fees.tuition}</div>
              {institution.fees.hostel && <div className="text-xs text-[#b0b0b0]">+ Hostel: {institution.fees.hostel}</div>}
            </div>
            <div className="p-3 rounded-xl bg-[#f5f5f5] border border-[#ebebeb]">
              <div className="text-xs text-[#737373] mb-1">Placement Rate</div>
              <div className="text-sm font-bold text-emerald-600">{institution.placementRate ?? 'N/A'}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[#f5f5f5] border border-[#ebebeb]">
              <div className="text-xs text-[#737373] mb-1">Avg Package</div>
              <div className="text-sm font-bold text-[#0c0c1d]">{institution.avgPlacementSalary ?? 'N/A'}</div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-2">Courses Offered</h4>
            <div className="flex flex-wrap gap-1.5">
              {courseNames.map(name => <Badge key={name} variant="secondary" className="text-xs">{name}</Badge>)}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-2">Top Recruiters</h4>
            <div className="flex flex-wrap gap-1.5">
              {institution.topRecruiters.map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#737373]">Next Batch: {institution.startDate}</span>
            <span className="text-[#737373]">Application Fee: ₹{institution.fees.application}</span>
          </div>
          {institution.url && (
            <a href={`https://${institution.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#0c0c1d] hover:text-[#1a1a2e]">
              <ExternalLink className="h-3 w-3" /> Visit Website
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InternshipCard({ internship, onClick }: { internship: Internship; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-2xl border border-[#f0f0f0] bg-white hover:border-[#e0e0e0] hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-sm font-semibold text-[#0a0a0a] line-clamp-1">{internship.title}</h4>
        <ChevronRight className="h-4 w-4 text-[#d4d4d4] shrink-0" />
      </div>
      <div className="text-xs font-medium text-[#0c0c1d] mb-1">{internship.company}</div>
      <div className="flex items-center gap-2 text-xs text-[#b0b0b0] mb-2">
        <MapPin className="h-3 w-3" />{internship.location}
        <span>&middot;</span>
        <Clock className="h-3 w-3" />{internship.duration}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-emerald-600">{internship.stipend}</span>
        <span className="text-xs text-[#b0b0b0]">Apply by {internship.applyBy}</span>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {internship.skills.slice(0, 3).map(s => (
          <Badge key={s} variant="secondary" className="text-xs py-0">{s}</Badge>
        ))}
      </div>
    </button>
  );
}

function InternshipDialog({ internship, open, onOpenChange }: { internship: Internship | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!internship) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">{internship.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="text-sm font-semibold text-[#0c0c1d]">{internship.company}</div>
          <p className="text-sm text-[#4a4a4a]">{internship.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-[#4a4a4a]"><MapPin className="h-4 w-4 text-[#b0b0b0]" /> {internship.location}</div>
            <div className="flex items-center gap-1 text-[#4a4a4a]"><Clock className="h-4 w-4 text-[#b0b0b0]" /> {internship.duration}</div>
            <div className="flex items-center gap-1 text-emerald-600 font-semibold"><DollarSign className="h-4 w-4" /> {internship.stipend}</div>
            <div className="flex items-center gap-1 text-[#b8965a]"><Users className="h-4 w-4" /> Apply by {internship.applyBy}</div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1">Required Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {internship.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            </div>
          </div>
          {internship.url && (
            <a href={`https://${internship.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#0c0c1d] hover:text-[#1a1a2e]">
              <ExternalLink className="h-3 w-3" /> Apply Now
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GovtCourseCard({ course, onClick }: { course: GovtCourse; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-2xl border border-[#f0f0f0] bg-white hover:border-[#e0e0e0] hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-sm font-semibold text-[#0a0a0a] line-clamp-1">{course.name}</h4>
        {course.cost === 'Free' && <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">Free</Badge>}
      </div>
      <div className="text-xs font-medium text-emerald-600 mb-1">{course.provider}</div>
      <div className="flex items-center gap-2 text-xs text-[#b0b0b0] mb-2">
        <Clock className="h-3 w-3" />{course.duration}
        <span>&middot;</span>
        <span>{course.cost}</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {course.skills.slice(0, 3).map(s => (
          <Badge key={s} variant="secondary" className="text-xs py-0">{s}</Badge>
        ))}
      </div>
    </button>
  );
}

function GovtCourseDialog({ course, open, onOpenChange }: { course: GovtCourse | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!course) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">{course.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">{course.provider}</Badge>
          <p className="text-sm text-[#4a4a4a]">{course.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-[#4a4a4a]"><Clock className="h-4 w-4 text-[#b0b0b0]" /> {course.duration}</div>
            <div className="flex items-center gap-1 text-[#4a4a4a]"><DollarSign className="h-4 w-4 text-emerald-500" /> {course.cost}</div>
            <div className="flex items-center gap-1 text-[#4a4a4a]"><Users className="h-4 w-4 text-[#b0b0b0]" /> {course.eligibility}</div>
            <div className="flex items-center gap-1 text-[#4a4a4a]"><Award className="h-4 w-4 text-[#0c0c1d]" /> {course.certification}</div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1">Skills Covered</h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            </div>
          </div>
          {course.url && (
            <a href={`https://${course.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#0c0c1d] hover:text-[#1a1a2e]">
              <ExternalLink className="h-3 w-3" /> Enroll Now
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortCourseCard({ course, onClick }: { course: ShortCourse; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-2xl border border-[#f0f0f0] bg-white hover:border-[#e0e0e0] hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-sm font-semibold text-[#0a0a0a] line-clamp-1">{course.name}</h4>
        <Badge variant="outline" className="text-xs shrink-0">{course.mode}</Badge>
      </div>
      <div className="text-xs font-medium text-[#0c0c1d] mb-1">{course.provider}</div>
      <div className="flex items-center gap-2 text-xs text-[#b0b0b0] mb-2">
        <Clock className="h-3 w-3" />{course.duration}
        <span>&middot;</span>
        <DollarSign className="h-3 w-3" />{course.cost}
      </div>
      <div className="flex flex-wrap gap-1">
        {course.skills.slice(0, 3).map(s => (
          <Badge key={s} variant="secondary" className="text-xs py-0">{s}</Badge>
        ))}
      </div>
    </button>
  );
}

function ShortCourseDialog({ course, open, onOpenChange }: { course: ShortCourse | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!course) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">{course.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="flex gap-2">
            <Badge>{course.provider}</Badge>
            <Badge variant="outline">{course.mode}</Badge>
            <Badge variant="secondary">{course.field}</Badge>
          </div>
          <p className="text-sm text-[#4a4a4a]">{course.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-[#4a4a4a]"><Clock className="h-4 w-4 text-[#b0b0b0]" /> {course.duration}</div>
            <div className="flex items-center gap-1 text-[#4a4a4a]"><DollarSign className="h-4 w-4 text-emerald-500" /> {course.cost}</div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#0a0a0a] mb-1">Skills You&apos;ll Gain</h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            </div>
          </div>
          {course.url && (
            <a href={`https://${course.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[#0c0c1d] hover:text-[#1a1a2e]">
              <ExternalLink className="h-3 w-3" /> Enroll Now
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DiscoverSection() {
  const { country } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<UniqueCourse | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [selectedGovtCourse, setSelectedGovtCourse] = useState<GovtCourse | null>(null);
  const [selectedShortCourse, setSelectedShortCourse] = useState<ShortCourse | null>(null);

  const filteredCourses = uniqueCoursesDatabase.filter(c => {
    const matchesCountry = !country || c.countries.includes(country);
    const matchesSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.field.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const filteredInternships = internshipDatabase.filter(i => !country || i.country === country);
  const filteredGovtCourses = govtCourseDatabase.filter(g => !country || g.country === country);
  const filteredShortCourses = shortCourseDatabase.filter(s => !country || s.country === country);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Discover"
        subtitle="Explore unique courses, internships, government programs & short courses"
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b0b0b0]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search courses, skills, fields..."
          className="premium-input pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-[#f5f5f5] rounded-xl p-1 border border-[#f0f0f0]">
          <TabsTrigger value="courses" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-[#0c0c1d]">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />Courses
          </TabsTrigger>
          <TabsTrigger value="internships" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-[#0c0c1d]">
            <Briefcase className="h-3.5 w-3.5 mr-1.5" />Internships
          </TabsTrigger>
          <TabsTrigger value="govt" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-[#0c0c1d]">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />Govt
          </TabsTrigger>
          <TabsTrigger value="short" className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-[#0c0c1d]">
            <Clock className="h-3.5 w-3.5 mr-1.5" />Short
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-4">
          <div className="mb-3">
            <p className="text-xs text-[#737373]">
              {filteredCourses.length} unique courses found
              {country ? ` for ${country}` : ' globally'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => setSelectedCourse(course)}
              />
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-[#737373]">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-[#d4d4d4]" />
              <p className="text-sm">No courses found. Try adjusting your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="internships" className="mt-4">
          <div className="mb-3">
            <p className="text-xs text-[#737373]">{filteredInternships.length} internships available</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredInternships.map(internship => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                onClick={() => setSelectedInternship(internship)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="govt" className="mt-4">
          <div className="mb-3">
            <p className="text-xs text-[#737373]">{filteredGovtCourses.length} government programs available</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGovtCourses.map(course => (
              <GovtCourseCard
                key={course.id}
                course={course}
                onClick={() => setSelectedGovtCourse(course)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="short" className="mt-4">
          <div className="mb-3">
            <p className="text-xs text-[#737373]">{filteredShortCourses.length} short courses available</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredShortCourses.map(course => (
              <ShortCourseCard
                key={course.id}
                course={course}
                onClick={() => setSelectedShortCourse(course)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CourseDialog course={selectedCourse} open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)} />
      <InstitutionDialog institution={selectedInstitution} open={!!selectedInstitution} onOpenChange={(open) => !open && setSelectedInstitution(null)} />
      <InternshipDialog internship={selectedInternship} open={!!selectedInternship} onOpenChange={(open) => !open && setSelectedInternship(null)} />
      <GovtCourseDialog course={selectedGovtCourse} open={!!selectedGovtCourse} onOpenChange={(open) => !open && setSelectedGovtCourse(null)} />
      <ShortCourseDialog course={selectedShortCourse} open={!!selectedShortCourse} onOpenChange={(open) => !open && setSelectedShortCourse(null)} />
    </div>
  );
}
