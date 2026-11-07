import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/auth';
import { listNetwork, saveNetwork, type NetworkPost } from '@/lib/network';
import { isBlobUrl } from '@/lib/r2';
const d = (v: unknown) => /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) : null;
const s = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n) || null;
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  const b = await req.json();
  const title = s(b.title, 140), start = d(b.start);
  if (!title || !start) return Response.json({ error: 'Title and start date are required.' }, { status: 400 });
  const img = s(b.image, 500);
  const p: NetworkPost = { id: crypto.randomUUID(), title, session: s(b.session, 140), host: s(b.host, 160), location: s(b.location, 120),
    start, end: d(b.end), youtube_url: s(b.youtube_url, 300), link: s(b.link, 500), image: img && (isBlobUrl(img) || img.startsWith('/img/')) ? img : null,
    details: s(b.details, 1500), created_at: new Date().toISOString() };
  if (!p.youtube_url && !p.image && !p.link) return Response.json({ error: 'Add a YouTube link, a flyer or a web link.' }, { status: 400 });
  const list = await listNetwork(); await saveNetwork([p, ...list]);
  ['/', '/conferences'].forEach(x => revalidatePath(x));
  return Response.json({ ok: true, post: p });
}
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  const list = await listNetwork(); await saveNetwork(list.filter(x => x.id !== id));
  ['/', '/conferences'].forEach(x => revalidatePath(x));
  return Response.json({ ok: true });
}
export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  return Response.json({ posts: await listNetwork() });
}
