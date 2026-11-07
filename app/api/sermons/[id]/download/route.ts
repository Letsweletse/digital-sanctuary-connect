import { downloadUrl, isBlobUrl } from '@/lib/r2';
import { bump, getSermonById } from '@/lib/sermons';
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getSermonById(id);
  if (!s?.audio_url || !s.published) return Response.redirect(new URL('/sermons', req.url), 302);
  await bump(id, 'downloads').catch(() => {});
  const ext = (s.audio_key?.split('.').pop() || s.audio_url.split('?')[0].split('.').pop() || 'mp3').toLowerCase();
  const name = `${s.preached_on} - ${s.title} - ${s.speaker}.${ext}`.replace(/[\\/:*?"<>|]/g, '');
  void name;
  const target = isBlobUrl(s.audio_url) ? downloadUrl(s.audio_url) : s.audio_url;
  return Response.redirect(target, 302);
}
