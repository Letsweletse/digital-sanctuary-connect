import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/auth';
import { removeObject, r2Ready, isBlobUrl } from '@/lib/r2';
import { updateSermon, deleteSermon, type SermonInput } from '@/lib/sermons';
const fields = ['title', 'speaker', 'preached_on', 'series', 'scripture', 'description', 'youtube_url', 'cover_image', 'published'] as const;
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  const b = await req.json(); const up: SermonInput = {};
  for (const f of fields) if (f in b) (up as Record<string, unknown>)[f] = b[f];
  try {
    const sermon = await updateSermon((await params).id, up);
    ['/', '/sermons', `/sermons/${sermon.slug}`].forEach(p => revalidatePath(p));
    return Response.json({ ok: true, sermon });
  } catch (e) { return Response.json({ error: (e as Error).message }, { status: 500 }); }
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  try {
    const s = await deleteSermon((await params).id);
    if (s?.audio_url && r2Ready() && isBlobUrl(s.audio_url)) await removeObject(s.audio_url).catch(() => {});
    ['/', '/sermons'].forEach(p => revalidatePath(p));
    return Response.json({ ok: true });
  } catch (e) { return Response.json({ error: (e as Error).message }, { status: 500 }); }
}
