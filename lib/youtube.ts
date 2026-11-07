// Sermons from the church YouTube channel (@gategaboronebotswana).
// ARCHIVE = every past video, imported 7 Nov 2026. New uploads are picked up automatically from the
// channel's public feed (checked at most once an hour), so the media team only has to upload to YouTube.
import type { Sermon } from './sermons';

export const CHANNEL_ID = 'UCSedxn-9WRR0_O0GwSPDmNw';

// [videoId, date, title, speaker, seconds]
const ARCHIVE: [string, string, string, string, number][] = [
  ["aEAhfVrQ8tI", "2026-10-25", "Hebron Continued - Session 4", "Gate Gaborone", 4145],
  ["pu-fLOw1M-g", "2026-09-27", "I Knew You", "Gate Gaborone", 3541],
  ["1BbRXOvP_qc", "2026-09-20", "Learning To Love One Another", "Gate Gaborone", 3310],
  ["UKM3qsuJO6Q", "2026-09-06", "Hebron Continued", "Gate Gaborone", 4175],
  ["SmJEAoSN6xg", "2026-08-30", "In Him We Move", "Gate Gaborone", 4810],
  ["yb6JoMl9IZg", "2026-08-16", "Hebron", "Gate Gaborone", 4301],
  ["MCkZl1fwh3U", "2026-08-09", "Hebron And Covenant", "Gate Gaborone", 4845],
  ["hp47IOHYSoI", "2026-08-02", "The Tabernacle of David", "Gate Gaborone", 3776],
  ["g9kBajiJssk", "2026-07-26", "The Seven Spirits of God", "Gate Gaborone", 4161],
  ["0b67OBzKDgU", "2026-07-12", "Hebron and Love", "Gate Gaborone", 4066],
  ["GmWLnGB0v8A", "2026-06-28", "The Brotherhood at Hebron", "Gate Gaborone", 3796],
  ["QTTQqNSI3yY", "2026-06-21", "Sonship From A Position of Hebron Part 2", "Gate Gaborone", 3646],
  ["lQY9xW12WVI", "2026-06-14", "Sonship From A Position of Hebron", "Gate Gaborone", 4338],
  ["VS2bilfIfhw", "2026-06-07", "A Mind of Peace", "Gate Gaborone", 3997],
  ["xKAbc2ZkBOw", "2026-05-31", "Water of the Word", "Pastor Oteng Leepile", 4016],
  ["PL3mwI3V6lk", "2026-05-24", "Mind Your Thoughts", "Gate Gaborone", 3316],
  ["HnmxOgi8oAE", "2026-05-17", "Intimacy with the Father", "Gate Gaborone", 3026],
  ["9IleGpzQXX0", "2026-05-10", "Wind Of Refreshing", "Gate Gaborone", 3976],
  ["PS6U6zP88zQ", "2026-05-09", "Perspectives on the Apostolic (POA) - Session 1", "Thamo Naidoo", 4831],
  ["RYe3CV0luLs", "2026-05-09", "Perspectives on the Apostolic (POA) - Session 2", "Thamo Naidoo", 4112],
  ["aT_p0v_hp1Y", "2026-05-09", "Perspectives on the Apostolic (POA) - Session 3", "Thamo Naidoo", 3303],
  ["ndsRYWqlhgA", "2026-05-03", "Fire of Hunger", "Gate Gaborone", 3691],
  ["vBMtui39JVI", "2026-04-26", "Finances and Hospitality", "Gate Gaborone", 4231],
  ["REeGgQNHUaU", "2026-04-12", "Giving Of Offerings", "Gate Gaborone", 4976],
  ["SWSwYCzZo9Y", "2026-03-15", "Attitude of Obedience", "Gate Gaborone", 4131],
  ["PVviRvmYhvU", "2026-03-08", "The Power of God", "Thabiso Thwane", 2951],
  ["ZCPZ5-L1PEA", "2026-02-15", "Sunday Sermon", "Gate Gaborone", 4245],
  ["3-cpLM73F_w", "2026-02-08", "Grace to Increase", "Gate Gaborone", 4391],
  ["fCqnhAK3oGo", "2026-02-07", "Perspectives On The Apostolic - Session 2", "Thamo Naidoo", 3931],
  ["roWccHkvlm4", "2026-02-07", "Perspectives On The Apostolic - Session 1", "Thamo Naidoo", 4091],
  ["7zGidixeeo4", "2026-02-01", "Rule Your Mind", "Gate Gaborone", 3926],
  ["2t_QrwHqk7w", "2026-01-25", "The Relationship With The Holy Spirit", "Gate Gaborone", 3551],
  ["ByFRwPaCmow", "2026-01-18", "Sunday Sermon", "Gate Gaborone", 6271],
  ["NHCZBY7-a7A", "2026-01-11", "Sunday Sermon", "Gate Gaborone", 8666],
  ["u-IJ5cX8KA4", "2025-12-14", "The Christmas Feast", "Gate Gaborone", 5531],
  ["dYq3adNMTyU", "2025-12-07", "The Seven Pillars Of Wisdom", "Gate Gaborone", 5876],
  ["bY-s2ZQCQEU", "2025-11-30", "Thanksgiving", "Gate Gaborone", 9336],
  ["AtISL8_WaiQ", "2025-01-26", "Sunday Sermon", "Gate Gaborone", 5171],
  ["BvCN-Ptcbh8", "2023-04-02", "Full Sunday Service", "Gate Gaborone", 4423],
  // Sundays that exist only as livestreams
  ["AJ35XRGcGfc", "2026-11-01", "Hebron Continued - The Ruth Model", "Gate Gaborone", 0],
  ["E0dS_9bwmzM", "2026-10-18", "Hebron Continued Pt 2", "Gate Gaborone", 6936],
  ["Te66bT2b-no", "2026-10-11", "Overcoming Strongholds", "Gate Gaborone", 6443],
  ["1foeOtZgCro", "2026-09-13", "Hebron And Covenant Continued", "Gate Gaborone", 7237],
  ["Z-tNQ4DahUU", "2026-08-23", "Hebron And Covenant - Session 2", "Gate Gaborone", 5567],
  ["jlVtDnF7VCY", "2026-07-05", "Hebron and Oneness", "Gate Gaborone", 7155],
  ["nlw_LIaAsjw", "2026-04-19", "Sunday Sermon", "Gate Gaborone", 2869],
  ["t_pbDgp5Czc", "2026-03-29", "A Willing Heart And Finances", "Gate Gaborone", 6795],
  ["LtXcoZt8qWI", "2026-03-22", "Sunday Sermon", "Gate Gaborone", 7831],
  ["vuxjFQN1vnE", "2026-03-01", "Sunday Sermon", "Gate Gaborone", 8296],
  ["Goyw9vZro3w", "2026-02-22", "Sunday Sermon", "Gate Gaborone", 7039],
  ["Tcs2F4sNiyQ", "2025-11-23", "The Visibility of Christ", "Gate Gaborone", 6901],
  ["idSLEID6lP4", "2025-11-16", "Sunday Sermon", "Gate Gaborone", 6648],
  ["U_KMRXLEQbQ", "2025-11-09", "In The Beginning", "Gate Gaborone", 7202],
];

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
function dateFromTitle(t: string): string | null {
  let m = t.match(/(\d{1,2})(?:st|nd|rd|th)?[\s-]+([A-Za-z]{3,})[\s-]+(\d{4})/);
  let d: string, mo: string, y: string;
  if (m) [, d, mo, y] = m; else { m = t.match(/([A-Za-z]{3,})\s+(\d{1,2}),?\s*(\d{4})/); if (!m) return null; [, mo, d, y] = m; }
  const i = MONTHS.indexOf(mo.slice(0, 3).toLowerCase()); if (i < 0) return null;
  return `${y}-${String(i + 1).padStart(2, '0')}-${d.padStart(2, '0')}`;
}
function cleanTitle(t: string) {
  const s = t.replace(/^\s*(FULL\s+)?GATE Gaborone[\s,-]*/i, '').replace(/\s*-?\s*Sunday Sermon\s*/gi, ' - ')
    .replace(/\s*-?\s*(\d{1,2}(st|nd|rd|th)?[\s-]+[A-Za-z]{3,}[\s-]+\d{4}|[A-Za-z]{3,}\s+\d{1,2},?\s*\d{4})\s*$/, '')
    .replace(/\s+-\s*$/, '').replace(/^\s*-\s*/, '').replace(/\s+/g, ' ').trim();
  return s || 'Sunday Sermon';
}
const slugify = (date: string, title: string) => `${date}-${title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)}`;

function toSermon(id: string, date: string, title: string, speaker: string, secs: number | null): Sermon {
  return {
    id: `yt-${id}`, slug: slugify(date, title), title, speaker, preached_on: date,
    series: /apostolic/i.test(title) ? 'Perspectives On The Apostolic' : /hebron/i.test(title) ? 'Hebron' : 'Sunday Service',
    scripture: null, description: null, audio_url: null, audio_key: null, duration_seconds: secs, size_bytes: null, mime_type: null,
    youtube_url: `https://www.youtube.com/watch?v=${id}`, cover_image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    plays: 0, downloads: 0, published: true, created_at: `${date}T12:00:00Z`,
  };
}

async function latestFromFeed(): Promise<Sermon[]> {
  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const xml = await r.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
      const id = e.match(/<yt:videoId>([^<]+)/)?.[1] ?? '';
      const raw = (e.match(/<title>([^<]+)/)?.[1] ?? '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      const published = (e.match(/<published>([^<]+)/)?.[1] ?? '').slice(0, 10);
      return { id, raw, date: dateFromTitle(raw) || published };
    }).filter(v => v.id && v.date && !/worship night|scripture reading|#shorts/i.test(v.raw))
      .map(v => toSermon(v.id, v.date, cleanTitle(v.raw), /thwane/i.test(v.raw) ? 'Thabiso Thwane' : /apostolic/i.test(v.raw) ? 'Thamo Naidoo' : 'Gate Gaborone', null));
  } catch { return []; }
}

export async function youtubeSermons(): Promise<Sermon[]> {
  const byId = new Map<string, Sermon>();
  for (const [id, date, title, sp, secs] of ARCHIVE) byId.set(id, toSermon(id, date, title, sp, secs || null));
  // Each Sunday is often posted twice (livestream + edited upload): keep the first one we have for that date.
  const dates = new Set([...byId.values()].map(s => s.preached_on));
  for (const s of await latestFromFeed()) {
    if (byId.has(s.id.slice(3)) || dates.has(s.preached_on)) continue;
    byId.set(s.id.slice(3), s); dates.add(s.preached_on);
  }
  return [...byId.values()];
}
export function ytIdOf(url: string | null) { return url?.match(/[?&]v=([\w-]{11})/)?.[1] ?? null; }
