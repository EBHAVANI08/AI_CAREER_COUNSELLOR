import { createHash, randomBytes } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { db } from '@/lib/db';

const SESSION_COOKIE = 'careerai_session';
const SESSION_DAYS = 30;

function tokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function requestMetadata() {
  const requestHeaders = await headers();
  return {
    ipAddress: requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || requestHeaders.get('x-real-ip') || undefined,
    userAgent: requestHeaders.get('user-agent') || undefined,
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const metadata = await requestMetadata();

  await db.session.create({
    data: { tokenHash: tokenHash(token), userId, expiresAt, ...metadata },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  });
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: tokenHash(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: tokenHash(token) },
    include: {
      user: {
        include: {
          profile: true,
          memberships: { include: { organization: true } },
        },
      },
    },
  });

  if (!session || session.expiresAt <= new Date() || session.user.status !== 'ACTIVE') {
    if (session) await db.session.delete({ where: { id: session.id } });
    return null;
  }

  return session;
}

export async function requireSession() {
  const session = await getCurrentSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}
