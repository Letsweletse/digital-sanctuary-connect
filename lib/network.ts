// Conferences and live streams from the wider Gate Global Family that the pastor shares.
// Stored as one JSON file in the public Blob store; the admin "Conferences" tab adds and removes them.
import { r2Ready, getText, putText } from './r2';

export type NetworkPost = {
  id: string; title: string; session: string | null; host: string | null; location: string | null;
  start: string; end: string | null;            // ISO dates (YYYY-MM-DD)
  youtube_url: string | null; link: string | null; image: string | null; details: string | null; created_at: string;
};
const FILE = 'network/posts.json';

export const NETWORK_SEED: NetworkPost[] = [
  { id: 'asom-2026-day2-evening', title: 'ASOM 2026', session: 'Day 2 · Evening Session', host: null,
    location: 'Santiago, Dominican Republic', start: '2026-11-07', end: null,
    youtube_url: 'https://www.youtube.com/watch?v=--5qoWl7vpI', link: null, image: null, details: null, created_at: '2026-11-07T16:30:00Z' },
  { id: 'women-of-grace-20-years', title: 'Women of Grace: 20 Years of Grace', session: null,
    host: 'The Women Ministry of Fountain Gate Church', location: 'Kenya', start: '2026-10-18', end: '2026-10-25',
    youtube_url: null, link: null, image: '/img/women-of-grace-2026.jpg',
    details: 'Hosted by Dr Lucy Nganga (Kenya) with guest Mirolyn Naidoo (South Africa). Launch, virtual sessions, WOG retreat, Elect Ladies, WOG breakfast and celebration service. Contact: 0716919783, 0798599744.',
    created_at: '2026-10-10T10:00:00Z' },
];

export async function listNetwork(): Promise<NetworkPost[]> {
  let list = NETWORK_SEED;
  if (r2Ready()) {
    const t = await getText(FILE).catch(() => null);
    if (t) { try { list = JSON.parse(t); } catch { /* keep seed */ } }
  }
  return [...list].sort((a, b) => (b.start || '').localeCompare(a.start || '') || b.created_at.localeCompare(a.created_at));
}
export async function saveNetwork(list: NetworkPost[]) { await putText(FILE, JSON.stringify(list, null, 1)); }

export function ytEmbedId(u: string | null) { return u?.match(/(?:v=|youtu\.be\/|live\/|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? null; }
export function status(p: NetworkPost, today: string) {
  const end = p.end || p.start;
  if (today < p.start) return 'Upcoming';
  if (today <= end) return p.youtube_url ? 'Live' : 'Happening now';
  return 'Recent';
}
