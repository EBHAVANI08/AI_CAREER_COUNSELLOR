# Task 3: Graceful Database Fallback Handling for API Routes

## Agent: DB Fallback Agent
## Date: 2025-03-05

## Summary
Added graceful database fallback handling to all 15 API route files in the AI Counsellor project. When the database is unavailable, API routes now return a structured 503 error response instead of crashing.

## Changes Made

### Standard Pattern (13 files)
For each standard API route file, the following changes were applied:

1. **Import update**: Changed `import { db } from '@/lib/db'` to `import { db, isDbAvailable, getDbError } from '@/lib/db'`
2. **DB availability check**: Added `if (!isDbAvailable()) { return NextResponse.json({ error: "Database temporarily unavailable", dbError: getDbError() }, { status: 503 }) }` at the beginning of each exported handler function (before the try block)

Files updated with this pattern:
- `/src/app/api/user/route.ts` — GET, POST handlers
- `/src/app/api/recommend/route.ts` — GET handler
- `/src/app/api/skill-gap/route.ts` — GET handler
- `/src/app/api/market/route.ts` — GET handler
- `/src/app/api/career-path/route.ts` — GET handler
- `/src/app/api/seed/route.ts` — POST, GET handlers
- `/src/app/api/jobs/route.ts` — GET handler
- `/src/app/api/save-job/route.ts` — POST, GET handlers
- `/src/app/api/auth/user/route.ts` — GET, PUT handlers
- `/src/app/api/auth/login/route.ts` — POST handler
- `/src/app/api/auth/oauth-callback/route.ts` — POST handler
- `/src/app/api/auth/register/route.ts` — POST handler
- `/src/app/api/auth/check-email/route.ts` — GET handler
- `/src/app/api/assessment-status/route.ts` — GET handler

### Special Pattern (1 file)
- `/src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler with special handling:
  1. **Import update**: Changed `import { db } from '@/lib/db'` to `import { db, isDbAvailable } from '@/lib/db'` (no `getDbError` needed since NextAuth doesn't use JSON error responses)
  2. **CredentialsProvider authorize function**: Added `if (!isDbAvailable()) return null` at the start — returns null (which causes NextAuth to show "CredentialsSignin" error) instead of crashing
  3. **signIn callback**: Added `if (!isDbAvailable()) return true` before DB operations — allows OAuth sign-in to proceed even if DB sync fails (consistent with existing error handling pattern)

## Lint Results
All modified API route files pass lint with zero errors. Pre-existing lint errors in component files (CareerPathPage, CoursesPage, ProfilePage, etc.) are unrelated to this task.

## Error Response Format
- **Standard routes**: `{ error: "Database temporarily unavailable", dbError: <string|null> }` with HTTP 503
- **NextAuth credentials**: Returns `null` from authorize → NextAuth handles as CredentialsSignin
- **NextAuth OAuth**: Returns `true` from signIn callback → allows sign-in to proceed without DB sync
