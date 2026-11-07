// Event registrations and pledges, kept in a PRIVATE Vercel Blob store (gate-registrations).
// Each new registration is its own file, so two people registering at once never overwrite each other.
// Records imported from the old website live in one file: imported/old-site.json.
import { put, list, get } from '@vercel/blob';

const token = () => process.env.REG_READ_WRITE_TOKEN;
export const regReady = () => !!token();

export type Registration = {
  id: string; event: string; event_slug: string; event_date: string; created_at: string;
  title: string; name: string; email: string; phone: string; role: string; church: string;
  attendees: number; message: string; source: 'website' | 'old-site';
};
export type Pledge = {
  id: string; event: string; created_at: string; name: string; email: string; phone: string;
  currency: string; amount: number; message: string; source: 'old-site' | 'website';
};

async function readJson<T>(pathname: string): Promise<T | null> {
  const r = await get(pathname, { access: 'private', token: token(), useCache: false } as never).catch(() => null);
  if (!r || !('stream' in r) || !r.stream) return null;
  const txt = await new Response(r.stream as ReadableStream).text();
  try { return JSON.parse(txt) as T; } catch { return null; }
}
async function writeJson(pathname: string, data: unknown, overwrite = false) {
  await put(pathname, JSON.stringify(data), { access: 'private', token: token(), contentType: 'application/json', addRandomSuffix: false, allowOverwrite: overwrite } as never);
}

export async function addRegistration(r: Registration) {
  await writeJson(`registrations/${r.event_slug}/${r.created_at.replace(/[:.]/g, '-')}-${r.id.slice(0, 8)}.json`, r);
}

export async function listRegistrations(): Promise<Registration[]> {
  const out: Registration[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix: 'registrations/', token: token(), cursor, limit: 1000 });
    const items = await Promise.all(res.blobs.map(b => readJson<Registration>(b.pathname)));
    items.forEach(x => x && out.push(x));
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  const old = await readJson<{ registrations: Registration[] }>('imported/old-site.json');
  if (old?.registrations) out.push(...old.registrations);
  return out.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
export async function listPledges(): Promise<Pledge[]> {
  const old = await readJson<{ pledges: Pledge[] }>('imported/old-site.json');
  return (old?.pledges ?? []).sort((a, b) => b.created_at.localeCompare(a.created_at));
}
export async function hasImported() { return !!(await readJson<object>('imported/old-site.json')); }
export async function saveImported(data: { registrations: Registration[]; pledges: Pledge[]; imported_at: string }) {
  await writeJson('imported/old-site.json', data, true);
}
