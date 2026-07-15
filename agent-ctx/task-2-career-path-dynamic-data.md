# Task 2: Career Path Dynamic Data & UI Enhancement

## Summary

Fixed critical data type mapping bugs and added expandable detail cards with Dialog components to the CareerPathPage.

## Changes Made

### 1. `/src/app/api/dynamic-data/route.ts`
- Added 4 new data generators: `govt-programs`, `living-costs`, `study-abroad`, `tuition-data`
- Updated `DataType` union type to include new types
- Updated `generators` Record to map new types to their generator functions

### 2. `/src/lib/dynamic-data-context.tsx`
- Added `govt-programs`, `living-costs`, `study-abroad`, `tuition-data` to `DataType` union
- Added new types to `coreTypes` prefetch array

### 3. `/src/app/page.tsx` - CareerPathPage component
- **Fixed broken mappings**: govtPrograms, livingCosts, studyAbroadCountries, tuitionData all incorrectly mapped to `'unique-courses'` or `'market-insights'` - now correctly mapped to their dedicated types
- **Added state variables** for selected items: selectedUniversity, selectedProgram, selectedExam, selectedGovtProgram, selectedInternship, selectedLivingCost, selectedJobSector, selectedStudyAbroadCountry, selectedTuitionEntry
- **Made all cards clickable** with cursor-pointer, group hover effects, ChevronRight indicators
- **Added "View Details" buttons** to each card
- **Added 10 Dialog components** for expanded detail views:
  - University Detail Dialog (India section)
  - Program Detail Dialog (India section)
  - Exam Detail Dialog (India section)
  - Govt Program Detail Dialog (India section)
  - Internship Detail Dialog (India section)
  - Living Cost Detail Dialog (India section)
  - Job Market Sector Detail Dialog (India section)
  - Study Abroad Country Detail Dialog (Abroad section)
  - Study Abroad Country Detail Dialog (Global section - reused)
  - Tuition Detail Dialog (Global section)

## Lint Status
- No new lint errors introduced
- All 10 existing lint errors are pre-existing (refs during render, static components, memoization, setState in effect)
