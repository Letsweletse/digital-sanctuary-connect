import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE = 'gg_admin';
function token() {
  const k = process.env.ADMIN_KEY || '';
  return crypto.createHmac('sha256', k).update('gate-gaborone-admin').digest('hex');
}
export function checkKey(key: string) {
  const k = process.env.ADMIN_KEY || '';
  if (!k || k.length < 8) return false;
  const a = Buffer.from(key), b = Buffer.from(k);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
export async function isAdmin() {
  if (!process.env.ADMIN_KEY) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  return c === token();
}
export async function setAdmin() {
  (await cookies()).set(COOKIE, token(), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
}
export async function clearAdmin() { (await cookies()).delete(COOKIE); }
