import { db } from './db';

export type Sermon = {
  id: string; slug: string; title: string; speaker: string; preached_on: string;
  series: string | null; scripture: string | null; description: string | null;
  audio_url: string | null; audio_key: string | null; duration_seconds: number | null; size_bytes: number | null;
  mime_type: string | null; youtube_url: string | null; cover_image: string | null;
  plays: number; downloads: number; published: boolean; created_at: string;
};

// Shown until the database is connected, and kept as the first records when it is.
export const SEED: Sermon[] = [
  { id: 'seed-1', slug: '2025-10-05-the-wisdom-of-god', title: 'The Wisdom of God', speaker: 'Pastor Kobus Bezuidenhout',
    preached_on: '2025-10-05', series: 'Sunday Service', scripture: null,
    description: 'Sunday sermon on the wisdom of God, delivered by Pastor Kobus Bezuidenhout.',
    audio_url: null, audio_key: null, duration_seconds: null, size_bytes: null, mime_type: null,
    youtube_url: 'https://www.youtube.com/watch?v=OVYHy6jebeo', cover_image: '/img/kobus-portrait.jpg',
    plays: 0, downloads: 0, published: true, created_at: '2025-10-05T10:00:00Z' },
  { id: 'seed-2', slug: '2024-10-12-the-lord-as-master', title: 'The Lord as Master', speaker: 'Peter Taylor',
    preached_on: '2024-10-12', series: 'Sunday Service', scripture: null,
    description: 'Sunday sermon on the Lordship of Christ, delivered by Peter Taylor.',
    audio_url: null, audio_key: null, duration_seconds: null, size_bytes: null, mime_type: null,
    youtube_url: 'https://www.youtube.com/watch?v=MK_KDfNjML4', cover_image: '/img/peter-naomi-taylor-2.jpg',
    plays: 0, downloads: 0, published: true, created_at: '2024-10-12T10:00:00Z' },
];

/* The church's existing Supabase table (shared with the old site) has these columns:
   id, title, speaker, speaker_image, date, audio_url, youtube_id, description, tags[], thumbnail_url,
   featured, duration (text), downloads, views, series, created_at, updated_at.
   We map to/from it here so no database migration is needed. Extra details (scripture, file key,
   size, hidden) are kept as prefixed entries in `tags`. */
type Row = {
  id: string; title: string; speaker: string; speaker_image: string | null; date: string; audio_url: string | null;
  youtube_id: string | null; description: string | null; tags: string[] | null; thumbnail_url: string | null;
  featured: boolean | null; duration: string | null; downloads: number | null; views: number | null;
  series: string | null; created_at: string;
};
const meta = (tags: string[] | null, k: string) => (tags || []).find(t => t.startsWith(k + ':'))?.slice(k.length + 1) ?? null;
function keyFromUrl(u: string | null) {
  const base = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
  return u && base && u.startsWith(base + '/') ? u.slice(base.length + 1) : null;
}
function ytUrl(id: string | null) {
  if (!id) return null;
  return id.startsWith('http') ? id : `https://www.youtube.com/watch?v=${id}`;
}
export function ytId(v: string | null | undefined) {
  if (!v) return null;
  const m = v.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/); return m ? m[1] : /^[\w-]{11}$/.test(v) ? v : null;
}
function fromRow(r: Row): Sermon {
  const date = (r.date || r.created_at).slice(0, 10);
  const dur = r.duration && /^\d+$/.test(r.duration) ? Number(r.duration) : null;
  return {
    id: r.id, slug: `${slugify(date, r.title)}-${r.id.slice(0, 8)}`, title: r.title.replace(/^Sunday Sermon\s*[-–:]\s*/i, ''),
    speaker: r.speaker, preached_on: date, series: r.series, scripture: meta(r.tags, 'scripture'),
    description: r.description, audio_url: r.audio_url, audio_key: meta(r.tags, 'key') || keyFromUrl(r.audio_url),
    duration_seconds: dur, size_bytes: Number(meta(r.tags, 'size')) || null, mime_type: meta(r.tags, 'mime'),
    youtube_url: ytUrl(r.youtube_id), cover_image: r.thumbnail_url || r.speaker_image || '/img/kobus-portrait.jpg',
    plays: r.views ?? 0, downloads: r.downloads ?? 0, published: !(r.tags || []).includes('hidden'), created_at: r.created_at,
  };
}
export type SermonInput = Partial<Pick<Sermon, 'title' | 'speaker' | 'preached_on' | 'series' | 'scripture' | 'description' |
  'youtube_url' | 'cover_image' | 'published' | 'audio_url' | 'audio_key' | 'duration_seconds' | 'size_bytes' | 'mime_type'>>;
function toRow(i: SermonInput, prevTags: string[] = []) {
  const r: Record<string, unknown> = {};
  if (i.title !== undefined) r.title = i.title;
  if (i.speaker !== undefined) r.speaker = i.speaker;
  if (i.preached_on !== undefined) r.date = `${i.preached_on}T00:00:00+00:00`;
  if (i.series !== undefined) r.series = i.series || null;
  if (i.description !== undefined) r.description = i.description || null;
  if (i.youtube_url !== undefined) r.youtube_id = ytId(i.youtube_url);
  if (i.cover_image !== undefined) r.thumbnail_url = i.cover_image || null;
  if (i.audio_url !== undefined) r.audio_url = i.audio_url;
  if (i.duration_seconds !== undefined) r.duration = i.duration_seconds ? String(Math.round(i.duration_seconds)) : null;
  let tags = [...prevTags]; let touched = false;
  const set = (k: string, v: unknown) => { touched = true; tags = tags.filter(t => !t.startsWith(k + ':')); if (v) tags.push(`${k}:${v}`); };
  if (i.scripture !== undefined) set('scripture', i.scripture);
  if (i.audio_key !== undefined) set('key', i.audio_key);
  if (i.size_bytes !== undefined) set('size', i.size_bytes);
  if (i.mime_type !== undefined) set('mime', i.mime_type);
  if (i.published !== undefined) { touched = true; tags = tags.filter(t => t !== 'hidden'); if (!i.published) tags.push('hidden'); }
  if (touched || !prevTags.length) r.tags = tags.length ? tags : ['Sunday Service'];
  return r;
}
// The old site saved some sermons more than once; show each only once (keep the earliest).
function dedupe(list: Sermon[]) {
  const seen = new Set<string>();
  return [...list].sort((a, b) => a.created_at.localeCompare(b.created_at))
    .filter(s => { const k = `${s.preached_on}|${s.title.toLowerCase()}|${s.youtube_url || s.audio_url || ''}`; if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => b.preached_on.localeCompare(a.preached_on) || b.created_at.localeCompare(a.created_at));
}

export async function listSermons(opts: { includeHidden?: boolean } = {}): Promise<Sermon[]> {
  const c = db();
  if (!c) return SEED;
  const { data, error } = await c.from('sermons').select('*').order('date', { ascending: false });
  if (error) { console.error('listSermons', error.message); return SEED; }
  const all = ((data as Row[]) ?? []).map(fromRow);
  const list = opts.includeHidden ? all : dedupe(all.filter(s => s.published));
  return list;
}
export async function getSermon(slug: string): Promise<Sermon | null> {
  const list = await listSermons();
  return list.find(s => s.slug === slug) ?? list.find(s => slug.endsWith(s.id.slice(0, 8))) ?? null;
}
export async function getSermonById(id: string): Promise<Sermon | null> {
  const c = db(); if (!c || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await c.from('sermons').select('*').eq('id', id).maybeSingle();
  return data ? fromRow(data as Row) : null;
}
export async function createSermon(i: SermonInput) {
  const c = db(); if (!c) throw new Error('Database is not configured yet.');
  const { data, error } = await c.from('sermons').insert({ ...toRow(i), featured: false, views: 0, downloads: 0 }).select().single();
  if (error) throw new Error(error.message);
  return fromRow(data as Row);
}
export async function updateSermon(id: string, i: SermonInput) {
  const c = db(); if (!c) throw new Error('No database');
  const { data: prev } = await c.from('sermons').select('tags').eq('id', id).maybeSingle();
  const { data, error } = await c.from('sermons').update({ ...toRow(i, prev?.tags || []), updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return fromRow(data as Row);
}
export async function deleteSermon(id: string) {
  const c = db(); if (!c) throw new Error('No database');
  const s = await getSermonById(id);
  const { error } = await c.from('sermons').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return s;
}
export async function bump(id: string, field: 'views' | 'downloads') {
  const c = db(); if (!c || !/^[0-9a-f-]{36}$/.test(id)) return;
  const { data } = await c.from('sermons').select(field).eq('id', id).maybeSingle();
  if (data) await c.from('sermons').update({ [field]: ((data as Record<string, number>)[field] || 0) + 1 }).eq('id', id);
}

export function slugify(date: string, title: string) {
  const t = title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);
  return `${date}-${t}`;
}
export function fmtDate(d: string) {
  return new Date(d + (d.length === 10 ? 'T12:00:00Z' : '')).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Gaborone' });
}
export function fmtDuration(s: number | null) {
  if (!s) return '';
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
}
export function fmtSize(b: number | null) { return b ? `${(b / 1048576).toFixed(1)} MB` : ''; }
