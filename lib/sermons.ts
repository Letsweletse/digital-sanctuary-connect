import { r2Ready, getText, putText } from './r2';

export type Sermon = {
  id: string; slug: string; title: string; speaker: string; preached_on: string;
  series: string | null; scripture: string | null; description: string | null;
  audio_url: string | null; audio_key: string | null; duration_seconds: number | null; size_bytes: number | null;
  mime_type: string | null; youtube_url: string | null; cover_image: string | null;
  plays: number; downloads: number; published: boolean; created_at: string;
};

// Shown until the database is connected, and kept as the first records when it is.
export const SEED: Sermon[] = [
  { id: 'poa-1', slug: '2025-06-02-perspectives-on-the-apostolic-session-1', title: 'Perspectives On The Apostolic: Session 1', speaker: 'Thamo Naidoo',
    preached_on: '2025-06-02', series: 'Perspectives On The Apostolic', scripture: null,
    description: 'Perspectives On The Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family.',
    audio_url: 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/sermon_audio/Perspective_on_the_Apostolic__Session_1_Thamo_Naidoo_2025_06_02.mp3', audio_key: null, duration_seconds: null, size_bytes: 57855020, mime_type: 'audio/mpeg',
    youtube_url: null, cover_image: '/img/poa-thamo-naidoo.jpg', plays: 0, downloads: 0, published: true, created_at: '2025-06-02T10:00:00Z' },
  { id: 'poa-2', slug: '2025-05-19-perspectives-on-the-apostolic-session-2', title: 'Perspectives On The Apostolic: Session 2', speaker: 'Thamo Naidoo',
    preached_on: '2025-05-19', series: 'Perspectives On The Apostolic', scripture: null,
    description: 'Perspectives On The Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family.',
    audio_url: 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/sermon_audio/Perspectives_On_The_Apostolic_Session_2_Thamo_Naidoo_2025_05_19.mp3', audio_key: null, duration_seconds: null, size_bytes: 61100204, mime_type: 'audio/mpeg',
    youtube_url: null, cover_image: '/img/poa-thamo-naidoo.jpg', plays: 0, downloads: 0, published: true, created_at: '2025-05-19T10:00:00Z' },
  { id: 'poa-3', slug: '2025-05-19-perspectives-on-the-apostolic-session-3', title: 'Perspectives On The Apostolic: Session 3', speaker: 'Thamo Naidoo',
    preached_on: '2025-05-19', series: 'Perspectives On The Apostolic', scripture: null,
    description: 'Perspectives On The Apostolic with Thamo Naidoo, Presiding Apostolic Elder of Gate Global Family.',
    audio_url: 'https://lojchdvtwypjqupsjynf.supabase.co/storage/v1/object/public/sermon_audio/Perspectives_On_The_Apostolic_Session_3_Thamo_Naidoo_2025_05_19.mp3', audio_key: null, duration_seconds: null, size_bytes: 56923052, mime_type: 'audio/mpeg',
    youtube_url: null, cover_image: '/img/poa-thamo-naidoo.jpg', plays: 0, downloads: 0, published: true, created_at: '2025-05-19T10:00:00Z' },
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

/* Sermon library storage: everything lives in the site's Vercel Blob store.
   Audio files sit under sermons/YYYY/…, and the list of messages is one small JSON file
   (catalog/sermons.json) that the admin page updates. No separate database to manage. */
const CATALOG = 'catalog/sermons.json';
export type SermonInput = Partial<Omit<Sermon, 'id' | 'slug' | 'plays' | 'downloads' | 'created_at'>>;

export function ytId(v: string | null | undefined) {
  if (!v) return null;
  const m = v.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/); return m ? m[1] : /^[\w-]{11}$/.test(v) ? v : null;
}
function normYt(v: string | null | undefined) { const id = ytId(v); return id ? `https://www.youtube.com/watch?v=${id}` : null; }

async function load(): Promise<Sermon[]> {
  if (!r2Ready()) return SEED;
  const txt = await getText(CATALOG).catch(() => null);
  if (!txt) return SEED;
  try { return JSON.parse(txt) as Sermon[]; } catch { return SEED; }
}
async function save(list: Sermon[]) {
  if (!r2Ready()) throw new Error('Audio storage is not connected yet.');
  await putText(CATALOG, JSON.stringify(list, null, 1));
}
const sortList = (l: Sermon[]) => [...l].sort((a, b) => b.preached_on.localeCompare(a.preached_on) || b.created_at.localeCompare(a.created_at));

export async function listSermons(opts: { includeHidden?: boolean } = {}): Promise<Sermon[]> {
  const all = sortList(await load());
  return opts.includeHidden ? all : all.filter(s => s.published);
}
export async function getSermon(slug: string): Promise<Sermon | null> {
  return (await listSermons()).find(s => s.slug === slug) ?? null;
}
export async function getSermonById(id: string): Promise<Sermon | null> {
  return (await load()).find(s => s.id === id) ?? null;
}
export async function createSermon(i: SermonInput) {
  const list = await load();
  const date = i.preached_on!, title = i.title!;
  let slug = slugify(date, title);
  if (list.some(s => s.slug === slug)) slug = `${slug}-${crypto.randomUUID().slice(0, 4)}`;
  const s: Sermon = {
    id: crypto.randomUUID(), slug, title, speaker: i.speaker!, preached_on: date,
    series: i.series ?? null, scripture: i.scripture ?? null, description: i.description ?? null,
    audio_url: i.audio_url ?? null, audio_key: i.audio_key ?? null, duration_seconds: i.duration_seconds ?? null,
    size_bytes: i.size_bytes ?? null, mime_type: i.mime_type ?? null, youtube_url: normYt(i.youtube_url),
    cover_image: i.cover_image || '/img/kobus-portrait.jpg', plays: 0, downloads: 0, published: i.published ?? true,
    created_at: new Date().toISOString(),
  };
  await save([s, ...list]);
  return s;
}
export async function updateSermon(id: string, i: SermonInput) {
  const list = await load(); const idx = list.findIndex(s => s.id === id);
  if (idx < 0) throw new Error('Message not found');
  const s = { ...list[idx], ...i } as Sermon;
  if ('youtube_url' in i) s.youtube_url = normYt(i.youtube_url);
  list[idx] = s; await save(list); return s;
}
export async function deleteSermon(id: string) {
  const list = await load(); const s = list.find(x => x.id === id) ?? null;
  await save(list.filter(x => x.id !== id)); return s;
}
// Play/download counts are not stored (keeps the catalog file simple and safe from clashes).
export async function bump(_id: string, _field: 'views' | 'downloads') {}

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
