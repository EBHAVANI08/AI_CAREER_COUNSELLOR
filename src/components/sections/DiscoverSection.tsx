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
  Technology: 'bg-indigo-500',
  Law: 'bg-amber-500',
  Science: 'bg-emerald-500',
  Finance: 'bg-blue-500',
  Engineering: 'bg-cyan-500',
  Hospitality: 'bg-rose-500',
  Environment: 'bg-green-500',
  Sports: 'bg-orange-500',
  Design: 'bg-fuchsia-500',
  Luxury: 'bg-yellow-500',
  Agriculture: 'bg-lime-500',
  Culture: 'bg-red-500',
  Media: 'bg-pink-500',
  Healthcare: 'bg-teal-500',
  Food: 'bg-orange-400',
};

function CourseCard({ course, onClick }: { course: UniqueCourse; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-xl border border-gray-200/80 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-3">
        <div className={`w-1 self-stretch rounded-full ${fieldAccentColors[course.field] || 'bg-indigo-500'} shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{course.name}</h3>
            <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">{course.field}</Badge>
            <span className="text-xs text-gray-400">&middot;</span>
            <span className="text-xs text-gray-500">{course.growthPotential.split('—')[0].trim()}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{course.whyUnique}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
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
            <Badge variant="outline" className="text-emerald-600 border-emerald-200">
              <TrendingUp className="h-3 w-3 mr-1" />{course.growthPotential}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">What makes this course unique?</h4>
            <p className="text-sm text-gray-600">{course.whyUnique}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Full Description</h4>
            <p className="text-sm text-gray-600">{course.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills You&apos;ll Learn</h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Career Outcomes & Salaries</h4>
            <div className="space-y-2">
              {course.careerOutcomes.map((outcome, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-700">{outcome.role}</span>
                  <span className="text-sm font-semibold text-indigo-600">{outcome.salaryRange}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Salary Progression</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-xs text-gray-500">Entry</div>
                <div className="text-sm font-bold text-emerald-700">{course.salaryRange.entry}</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-xs text-gray-500">Mid</div>
                <div className="text-sm font-bold text-blue-700">{course.salaryRange.mid}</div>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-indigo-50 border border-indigo-100">
                <div className="text-xs text-gray-500">Senior</div>
                <div className="text-sm font-bold text-indigo-700">{course.salaryRange.senior}</div>
              </div>
            </div>
          </div>

          {institutions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-500" />
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
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Similar Courses</h4>
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
    if (rank <= 10) return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-100"><Star className="h-3 w-3" />#{rank}</span>;
    if (rank <= 25) return <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-0.5 text-xs font-bold text-gray-600 border border-gray-200">#{rank}</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 border border-blue-100">#{rank}</span>;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 bg-white hover:border-gray-300 transition-all">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">{institution.name}</span>
            {getRankBadge(institution.ranking.national)}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            <span>{institution.location.city}, {institution.location.state}</span>
            <span>&middot;</span>
            <span>{institution.fees.tuition}</span>
          </div>
        </div>
        {institution.placementRate && (
          <div className="text-right shrink-0">
            <div className="text-xs text-gray-500">Placement</div>
            <div className="text-sm font-bold text-emerald-600">{institution.placementRate}%</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-gray-900">{institution.name}</h4>
        {getRankBadge(institution.ranking.national)}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          <span>{institution.location.city}, {institution.location.state}</span>
          <Badge variant="outline" className="text-xs py-0">{institution.type}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-gray-500"><DollarSign className="h-3 w-3" /> Tuition: {institution.fees.tuition}</div>
          {institution.fees.hostel && <div className="flex items-center gap-1 text-gray-500">Hostel: {institution.fees.hostel}</div>}
          {institution.placementRate && <div className="flex items-center gap-1 text-emerald-600"><TrendingUp className="h-3 w-3" /> {institution.placementRate}% placed</div>}
          {institution.avgPlacementSalary && <div className="flex items-center gap-1 text-indigo-600"><Award className="h-3 w-3" /> {institution.avgPlacementSalary}</div>}
        </div>
        {institution.topRecruiters.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {institution.topRecruiters.slice(0, 4).map(r => (
              <span key={r} className="rounded bg-gray-50 px-1.5 py-0.5 text-xs text-gray-600 border border-gray-100">{r}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{institution.accreditation}</span>
          <span className="text-xs text-gray-400">Next: {institution.startDate}</span>
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
            {institution.ranking.national && <Badge variant="secondary" className="bg-amber-50 text-amber-700 border border-amber-100">National Rank #{institution.ranking.national}</Badge>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Location</div>
              <div className="text-sm font-medium text-gray-900">{institution.location.city}, {institution.location.state}</div>
              <div className="text-xs text-gray-400">{institution.location.tier} area</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Tuition Fee</div>
              <div className="text-sm font-bold text-indigo-600">{institution.fees.tuition}</div>
              {institution.fees.hostel && <div className="text-xs text-gray-400">+ Hostel: {institution.fees.hostel}</div>}
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Placement Rate</div>
              <div className="text-sm font-bold text-emerald-600">{institution.placementRate ?? 'N/A'}%</div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Avg Package</div>
              <div className="text-sm font-bold text-blue-600">{institution.avgPlacementSalary ?? 'N/A'}</div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Courses Offered</h4>
            <div className="flex flex-wrap gap-1.5">
              {courseNames.map(name => <Badge key={name} variant="secondary" className="text-xs">{name}</Badge>)}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Recruiters</h4>
            <div className="flex flex-wrap gap-1.5">
              {institution.topRecruiters.map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Next Batch: {institution.startDate}</span>
            <span className="text-gray-500">Application Fee: ₹{institution.fees.application}</span>
          </div>
          {institution.url && (
            <a href={`https://${institution.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600">
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
      className="w-full text-left p-4 rounded-xl border border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{internship.title}</h4>
        <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
      </div>
      <div className="text-xs font-medium text-indigo-500 mb-1">{internship.company}</div>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
        <MapPin className="h-3 w-3" />{internship.location}
        <span>&middot;</span>
        <Clock className="h-3 w-3" />{internship.duration}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-emerald-600">{internship.stipend}</span>
        <span className="text-xs text-gray-400">Apply by {internship.applyBy}</span>
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
          <div className="text-sm font-semibold text-indigo-500">{internship.company}</div>
          <p className="text-sm text-gray-600">{internship.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-gray-600"><MapPin className="h-4 w-4 text-gray-400" /> {internship.location}</div>
            <div className="flex items-center gap-1 text-gray-600"><Clock className="h-4 w-4 text-gray-400" /> {internship.duration}</div>
            <div className="flex items-center gap-1 text-emerald-600 font-semibold"><DollarSign className="h-4 w-4" /> {internship.stipend}</div>
            <div className="flex items-center gap-1 text-amber-600"><Users className="h-4 w-4" /> Apply by {internship.applyBy}</div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Required Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {internship.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            </div>
          </div>
          {internship.url && (
            <a href={`https://${internship.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600">
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
      className="w-full text-left p-4 rounded-xl border border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{course.name}</h4>
        {course.cost === 'Free' && <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">Free</Badge>}
      </div>
      <div className="text-xs font-medium text-emerald-600 mb-1">{course.provider}</div>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
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
          <p className="text-sm text-gray-600">{course.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-gray-600"><Clock className="h-4 w-4 text-gray-400" /> {course.duration}</div>
            <div className="flex items-center gap-1 text-gray-600"><DollarSign className="h-4 w-4 text-emerald-500" /> {course.cost}</div>
            <div className="flex items-center gap-1 text-gray-600"><Users className="h-4 w-4 text-gray-400" /> {course.eligibility}</div>
            <div className="flex items-center gap-1 text-gray-600"><Award className="h-4 w-4 text-indigo-500" /> {course.certification}</div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Skills Covered</h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            </div>
          </div>
          {course.url && (
            <a href={`https://${course.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600">
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
      className="w-full text-left p-4 rounded-xl border border-gray-200/80 bg-white hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{course.name}</h4>
        <Badge variant="outline" className="text-xs shrink-0">{course.mode}</Badge>
      </div>
      <div className="text-xs font-medium text-indigo-500 mb-1">{course.provider}</div>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
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
          <p className="text-sm text-gray-600">{course.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1 text-gray-600"><Clock className="h-4 w-4 text-gray-400" /> {course.duration}</div>
            <div className="flex items-center gap-1 text-gray-600"><DollarSign className="h-4 w-4 text-emerald-500" /> {course.cost}</div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Skills You&apos;ll Gain</h4>
            <div className="flex flex-wrap gap-1.5">
              {course.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
            </div>
          </div>
          {course.url && (
            <a href={`https://${course.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600">
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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
        <TabsList className="w-full grid grid-cols-4 bg-gray-50 rounded-lg p-1 border border-gray-100">
          <TabsTrigger value="courses" className="rounded-md text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-indigo-600">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />Courses
          </TabsTrigger>
          <TabsTrigger value="internships" className="rounded-md text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-indigo-600">
            <Briefcase className="h-3.5 w-3.5 mr-1.5" />Internships
          </TabsTrigger>
          <TabsTrigger value="govt" className="rounded-md text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-indigo-600">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />Govt
          </TabsTrigger>
          <TabsTrigger value="short" className="rounded-md text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-indigo-600">
            <Clock className="h-3.5 w-3.5 mr-1.5" />Short
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-4">
          <div className="mb-3">
            <p className="text-xs text-gray-500">
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
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No courses found. Try adjusting your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="internships" className="mt-4">
          <div className="mb-3">
            <p className="text-xs text-gray-500">{filteredInternships.length} internships available</p>
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
            <p className="text-xs text-gray-500">{filteredGovtCourses.length} government programs available</p>
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
            <p className="text-xs text-gray-500">{filteredShortCourses.length} short courses available</p>
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
