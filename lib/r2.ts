// Audio + catalog storage on Vercel Blob (connected to the project; the token is injected by Vercel).
import { put, del, list } from '@vercel/blob';

export function r2Ready() { return !!process.env.BLOB_READ_WRITE_TOKEN; }

export async function getText(key: string) {
  const { blobs } = await list({ prefix: key, limit: 5 });
  const b = blobs.find(x => x.pathname === key);
  if (!b) return null;
  const r = await fetch(`${b.url}?t=${Date.now()}`, { cache: 'no-store' });
  return r.ok ? await r.text() : null;
}
export async function putText(key: string, body: string) {
  await put(key, body, { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60 });
}
export async function removeObject(url: string) { await del(url); }
export function isBlobUrl(u: string) {
  try { return new URL(u).hostname.endsWith('.public.blob.vercel-storage.com'); } catch { return false; }
}
export function downloadUrl(url: string) { return `${url}${url.includes('?') ? '&' : '?'}download=1`; }
