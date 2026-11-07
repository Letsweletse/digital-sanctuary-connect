import { isAdmin } from '@/lib/auth';
import { r2Ready, uploadUrl } from '@/lib/r2';
const OK = ['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm'];
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  if (!r2Ready()) return Response.json({ error: 'Audio storage (R2) is not configured yet.' }, { status: 503 });
  const { filename, contentType, size, date } = await req.json();
  const type = String(contentType || 'audio/mpeg');
  if (!OK.includes(type)) return Response.json({ error: `Unsupported file type (${type}). Please upload MP3 or M4A.` }, { status: 400 });
  if (Number(size) > 600 * 1048576) return Response.json({ error: 'File is larger than 600 MB. Please export as MP3.' }, { status: 400 });
  const ext = (String(filename).split('.').pop() || 'mp3').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'mp3';
  const d = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10);
  const key = `sermons/${d.slice(0, 4)}/${d}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  return Response.json({ url: await uploadUrl(key, type), key });
}
