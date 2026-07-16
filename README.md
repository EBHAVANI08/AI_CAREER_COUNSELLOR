# CareerAI Enterprise SaaS

Multi-tenant AI career counselling platform for students, counsellors, teams, and institutions.

## Enterprise foundation

- MongoDB Atlas with Prisma and tenant-scoped indexes
- Password hashing with Node.js scrypt
- Opaque, hashed database sessions in HTTP-only cookies
- Organizations and OWNER/ADMIN/COUNSELLOR/MEMBER RBAC
- Persistent profiles, assessment attempts, chat threads, usage events, and audit logs
- Per-plan monthly AI quotas with Z.AI primary and Groq fallback
- Razorpay subscription creation and signed webhook processing
- Security headers, validation, auth rate limiting, and database health monitoring
- Production TypeScript enforcement and standalone-compatible Next.js build

## Local setup

1. Copy `.env.example` to `.env` and set server-side secrets.
2. Install dependencies with `npm install`.
3. Generate and sync the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run `npm run dev` and open http://localhost:3000.

## Production checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The health endpoint is `GET /api/health`. It returns HTTP 503 when MongoDB is unavailable.

## Razorpay activation

Create monthly PRO and TEAM plans in Razorpay, add their IDs to the environment, and configure a webhook pointing to:

```text
https://YOUR_DOMAIN/api/billing/webhook
```

Use the same signing secret in `RAZORPAY_WEBHOOK_SECRET`. Subscribe to subscription lifecycle events including authenticated, activated, pending, halted, cancelled, completed, and expired.

## Security

Never commit `.env`. Rotate any credentials shared in chat, logs, screenshots, or source history. Use separate Atlas and Razorpay credentials for development, staging, and production.
