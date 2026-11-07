import { listSermons } from '@/lib/sermons';
import { SITE } from '@/lib/site';
export const revalidate = 300;
const x = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]!));
export async function GET() {
  const items = (await listSermons()).filter(s => s.audio_url);
  const art = `${SITE.url}/img/podcast-cover.jpg`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Gate Gaborone Sermons</title>
<link>${SITE.url}/sermons</link>
<atom:link href="${SITE.url}/podcast.xml" rel="self" type="application/rss+xml"/>
<language>en</language>
<description>${x(SITE.description)}</description>
<itunes:author>Gate Gaborone</itunes:author>
<itunes:image href="${art}"/>
<itunes:category text="Religion &amp; Spirituality"><itunes:category text="Christianity"/></itunes:category>
<itunes:explicit>false</itunes:explicit>
<itunes:owner><itunes:name>Gate Gaborone</itunes:name><itunes:email>${SITE.email}</itunes:email></itunes:owner>
${items.map(s => `<item>
<title>${x(s.title)}</title>
<itunes:author>${x(s.speaker)}</itunes:author>
<description>${x(s.description || `${s.title} by ${s.speaker}`)}</description>
<link>${SITE.url}/sermons/${s.slug}</link>
<guid isPermaLink="false">${s.id}</guid>
<pubDate>${new Date(s.preached_on + 'T10:00:00+02:00').toUTCString()}</pubDate>
<enclosure url="${x(s.audio_url!)}" length="${s.size_bytes || 0}" type="${s.mime_type || 'audio/mpeg'}"/>
${s.duration_seconds ? `<itunes:duration>${s.duration_seconds}</itunes:duration>` : ''}
</item>`).join('\n')}
</channel>
</rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
