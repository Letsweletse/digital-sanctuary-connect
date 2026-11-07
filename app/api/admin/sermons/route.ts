import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/auth';
import { isBlobUrl } from '@/lib/r2';
import { createSermon } from '@/lib/sermons';
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  const b = await req.json();
  const title = String(b.title || '').trim(), speaker = String(b.speaker || '').trim(), date = String(b.date || '');
  if (!title || !speaker || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ error: 'Title, speaker and date are required.' }, { status: 400 });
  const key = b.key ? String(b.key) : null;
  try {
    const sermon = await createSermon({
      title, speaker, preached_on: date, series: b.series || null, scripture: b.scripture || null, description: b.description || null,
      audio_key: key, audio_url: b.url && isBlobUrl(String(b.url)) ? String(b.url) : null,
      duration_seconds: b.duration ? Number(b.duration) : null, size_bytes: b.size ? Number(b.size) : null, mime_type: b.mime || null,
      youtube_url: b.youtube_url || null, cover_image: b.cover_image || null, published: true,
    });
    ['/', '/sermons', '/podcast.xml'].forEach(p => revalidatePath(p));
    return Response.json({ ok: true, sermon });
  } catch (e) { return Response.json({ error: (e as Error).message }, { status: 500 }); }
}
