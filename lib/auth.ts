import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

// One shared password (env ADMIN_PASSWORD) and a signed cookie. Enough for a one-person admin page.
const COOKIE = 'pearls_admin';
const DAYS = 30;
const key = () => createHmac('sha256', 'pearls-admin').update(process.env.ADMIN_PASSWORD || '').digest();
const sign = (v: string) => createHmac('sha256', key()).update(v).digest('hex');

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

export function passwordOk(pw: string) {
  const want = Buffer.from(process.env.ADMIN_PASSWORD || ''), got = Buffer.from(pw);
  return want.length > 0 && want.length === got.length && timingSafeEqual(want, got);
}

export async function startSession() {
  const exp = String(Date.now() + DAYS * 864e5);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: DAYS * 86400 });
}
export async function endSession() { (await cookies()).delete(COOKIE); }

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value || '';
  const [exp, sig] = v.split('.');
  if (!exp || !sig || +exp < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function requireAdmin() { if (!(await isAdmin())) throw new Error('צריך להתחבר מחדש'); }
