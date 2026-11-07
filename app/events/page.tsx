import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { upcoming, past, fmtEventDate } from '@/lib/events';
import { SITE } from '@/lib/site';
export const revalidate = 3600;
export const metadata: Metadata = { title: 'Events', description: 'Upcoming services, conferences and gatherings at Gate Gaborone.' };
export default function Events() {
  const up = upcoming(), pa = past();
  return (
    <>
      <PageHead eyebrow="Calendar" title={<>What’s <em>coming</em>.</>} lede="Worship, teaching and fellowship through the year. We gather every Sunday at 8:30 AM and 11:00 AM." />
      <section className="section"><div className="container">
        <p className="eyebrow">Upcoming</p>
        {up.length ? up.map(e => (
          <div key={e.slug} className="split" style={{ margin: '34px 0 70px' }}>
            {e.image && <div className="photo" style={{ aspectRatio: '4/3' }}><img src={e.image} alt={e.title} /></div>}
            <div><span className="pill">{e.category}</span><h2 className="h-lg" style={{ margin: '16px 0' }}>{e.title}</h2>
              <p className="lede">{fmtEventDate(e.date)} · {e.time}</p><p style={{ margin: '6px 0 16px', color: 'var(--muted)' }}>{e.venue}</p>
              <p style={{ marginBottom: 16 }}>{e.summary}</p>
              {e.fee && <p><b>Fee:</b> {e.fee}</p>}{e.contact && <p><b>Register:</b> {e.contact}</p>}</div>
          </div>)) : (
          <div className="card" style={{ marginTop: 28 }}><div className="pad" style={{ padding: 36 }}>
            <h3 className="h-md">No special events scheduled <em>right now</em>.</h3>
            <p style={{ marginTop: 12 }}>Join us for Sunday services at 8:30 AM and 11:00 AM, and house church on Wednesdays at 6:30 PM. Follow us on <a href={SITE.facebook} target="_blank" rel="noopener">Facebook</a> for announcements.</p>
          </div></div>)}
        {pa.length > 0 && <>
          <div className="rule" style={{ margin: '56px 0 34px' }} />
          <p className="eyebrow">Past events</p>
          <div className="grid g3" style={{ marginTop: 28 }}>{pa.map(e => (
            <div key={e.slug} className="card">{e.image && <img src={e.image} alt="" style={{ aspectRatio: '16/10', objectFit: 'cover', width: '100%' }} />}
              <div className="pad"><span className="pill">{e.category}</span><h3 style={{ margin: '12px 0 6px' }}>{e.title}</h3><p>{fmtEventDate(e.date)}</p></div></div>))}</div>
        </>}
      </div></section>
    </>
  );
}
