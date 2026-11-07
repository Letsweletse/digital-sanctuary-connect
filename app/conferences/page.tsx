import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { listNetwork, ytEmbedId, status } from '@/lib/network';
export const revalidate = 300;
export const metadata: Metadata = { title: 'Conferences', description: 'Conferences, live streams and gatherings across the Gate Global Family.' };
const fmt = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
export default async function Conferences() {
  const posts = await listNetwork();
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Gaborone' });
  return (
    <>
      <PageHead eyebrow="Conferences" title={<>Across the Gate Global <em>Family</em>.</>} lede="Conferences, live streams and gatherings from churches across our global family, shared by our pastors. Join live or watch again." />
      <section className="section"><div className="container">
        {!posts.length && <p className="lede">Nothing shared yet. Check back soon.</p>}
        <div className="grid g2" style={{ gap: 28, alignItems: 'start' }}>
          {posts.map(p => {
            const yt = ytEmbedId(p.youtube_url), st = status(p, today);
            return (
              <article key={p.id} className="card" style={{ overflow: 'hidden' }}>
                {yt ? <div style={{ aspectRatio: '16/9', background: '#000' }}><iframe src={`https://www.youtube-nocookie.com/embed/${yt}`} title={p.title} style={{ width: '100%', height: '100%', border: 0 }} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div>
                  : p.image ? <a href={p.image} target="_blank" rel="noopener"><img src={p.image} alt={p.title} loading="lazy" style={{ width: '100%', display: 'block' }} /></a> : null}
                <div className="pad" style={{ padding: 26 }}>
                  <span className="pill" style={st === 'Live' ? { background: '#fde2e2', color: '#b42318' } : undefined}>{st === 'Live' ? '● Live' : st}</span>
                  <h2 className="h-md" style={{ margin: '14px 0 6px' }}>{p.title}</h2>
                  {p.session && <p style={{ fontWeight: 600 }}>{p.session}</p>}
                  <p className="meta" style={{ marginTop: 6 }}>{[p.location, p.end && p.end !== p.start ? `${fmt(p.start)} – ${fmt(p.end)}` : fmt(p.start)].filter(Boolean).join(' · ')}</p>
                  {p.host && <p style={{ marginTop: 10, color: 'var(--muted)' }}>{p.host}</p>}
                  {p.details && <p style={{ marginTop: 10 }}>{p.details}</p>}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                    {p.youtube_url && <a className="btn btn-dark btn-sm" href={p.youtube_url} target="_blank" rel="noopener">{st === 'Live' ? 'Join live on YouTube' : 'Watch on YouTube'}</a>}
                    {p.link && <a className="btn btn-sm" href={p.link} target="_blank" rel="noopener">More information</a>}
                    <a className="btn btn-sm" href={`https://wa.me/?text=${encodeURIComponent(`${p.title}${p.session ? ` – ${p.session}` : ''}\n${p.youtube_url || p.link || 'https://gategaborone.co.bw/conferences'}`)}`} target="_blank" rel="noopener">Share on WhatsApp</a>
                  </div>
                </div>
              </article>);
          })}
        </div>
      </div></section>
    </>
  );
}
