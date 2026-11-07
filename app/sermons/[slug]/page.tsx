import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SermonActions from '@/components/SermonActions';
import { getSermon, listSermons, fmtDate, fmtDuration, fmtSize } from '@/lib/sermons';
import { SITE } from '@/lib/site';

export const revalidate = 60;
type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const s = await getSermon((await params).slug);
  if (!s) return { title: 'Sermon not found' };
  const desc = s.description || `${s.title} by ${s.speaker}, ${fmtDate(s.preached_on)}. Listen or download.`;
  return {
    title: s.title, description: desc,
    openGraph: { title: `${s.title} – ${s.speaker}`, description: desc, type: 'music.song', images: [s.cover_image || '/img/congregation.jpg'],
      audio: s.audio_url ? [{ url: s.audio_url, type: s.mime_type || 'audio/mpeg' }] : undefined },
  };
}

export default async function SermonPage({ params }: P) {
  const s = await getSermon((await params).slug);
  if (!s) notFound();
  const more = (await listSermons()).filter(x => x.id !== s.id).slice(0, 4);
  return (
    <>
      <section className="pagehead">
        <div className="container">
          <div className="split" style={{ gridTemplateColumns: '1.3fr .7fr' }}>
            <div>
              <p className="eyebrow">{s.series || 'Sunday message'} · {fmtDate(s.preached_on)}</p>
              <h1 className="h-lg" style={{ margin: '22px 0 16px' }}>{s.title}</h1>
              <p className="lede" style={{ marginBottom: 26 }}>{s.speaker}{s.scripture ? ` · ${s.scripture}` : ''}{s.duration_seconds ? ` · ${fmtDuration(s.duration_seconds)}` : ''}{s.size_bytes ? ` · ${fmtSize(s.size_bytes)}` : ''}</p>
              <SermonActions s={s} siteUrl={SITE.url} left />
            </div>
            <div className="photo" style={{ aspectRatio: '1/1', maxWidth: 360 }}><img src={s.cover_image || '/img/kobus-portrait.jpg'} alt={s.speaker} /></div>
          </div>
        </div>
      </section>
      <section className="section tight">
        <div className="container" style={{ maxWidth: 820 }}>
          {s.description && <p style={{ fontSize: 19, whiteSpace: 'pre-line' }}>{s.description}</p>}
          {s.youtube_url && /[?&]v=([\w-]{11})/.test(s.youtube_url) && (
            <div style={{ marginTop: 28, aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: '#000' }}>
              <iframe src={`https://www.youtube-nocookie.com/embed/${s.youtube_url.match(/[?&]v=([\w-]{11})/)![1]}`} title={s.title}
                style={{ width: '100%', height: '100%', border: 0 }} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen />
            </div>)}
          <div className="rule" />
          <p className="eyebrow">More messages</p>
          <div style={{ marginTop: 8 }}>
            {more.map(m => (
              <div key={m.id} className="srm" style={{ gridTemplateColumns: '1fr auto' }}>
                <div><div className="meta">{fmtDate(m.preached_on)} · {m.speaker}</div><h3 style={{ fontSize: 22 }}><Link href={`/sermons/${m.slug}`}>{m.title}</Link></h3></div>
                <Link className="iconbtn" href={`/sermons/${m.slug}`}>Open</Link>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 28 }}><Link className="btn" href="/sermons">All sermons</Link></p>
        </div>
      </section>
    </>
  );
}
