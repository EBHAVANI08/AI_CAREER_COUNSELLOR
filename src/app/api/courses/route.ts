import { NextRequest, NextResponse } from 'next/server';
import { uniqueCoursesDatabase, getInstitutionsForCourse, getCoursesForCountry, govtCourseDatabase, shortCourseDatabase } from '@/lib/ai/knowledge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, country, courseId } = body;

    if (type === 'unique') {
      const courses = country ? getCoursesForCountry(country) : uniqueCoursesDatabase;
      return NextResponse.json({ courses: courses.slice(0, 20) });
    }

    if (type === 'govt') {
      const courses = country ? govtCourseDatabase.filter(c => c.country === country) : govtCourseDatabase;
      return NextResponse.json({ courses });
    }

    if (type === 'short') {
      const courses = country ? shortCourseDatabase.filter(c => c.country === country) : shortCourseDatabase;
      return NextResponse.json({ courses });
    }

    if (type === 'institutions') {
      if (!courseId) {
        return NextResponse.json({ error: 'courseId required for institutions' }, { status: 400 });
      }
      const institutions = getInstitutionsForCourse(courseId, country || undefined);
      return NextResponse.json({ institutions });
    }

    return NextResponse.json({
      uniqueCourses: (country ? getCoursesForCountry(country) : uniqueCoursesDatabase).slice(0, 20),
      govtCourses: country ? govtCourseDatabase.filter(c => c.country === country) : govtCourseDatabase,
      shortCourses: country ? shortCourseDatabase.filter(c => c.country === country) : shortCourseDatabase,
    });
  } catch (error) {
    console.error('Courses API error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
