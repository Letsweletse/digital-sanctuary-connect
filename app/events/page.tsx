import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { upcoming, fmtEventDate } from '@/lib/events';
import { SITE } from '@/lib/site';
import RegistrationForm from '@/components/RegistrationForm';
export const revalidate = 3600;
export const metadata: Metadata = { title: 'Events', description: 'Upcoming services, conferences and gatherings at Gate Gaborone.' };
export default function Events() {
  const up = upcoming();
  return (
    <>
      <PageHead eyebrow="Calendar" title={<>What’s <em>coming</em>.</>} lede="Worship, teaching and fellowship through the year. We gather every Sunday at 8:30 AM." />
      <section className="section"><div className="container">
        <p className="eyebrow">Upcoming</p>
        {up.length ? up.map(e => (
          <div key={e.slug} className="split" style={{ margin: '34px 0 70px' }}>
            {e.image && <div className="photo" style={{ aspectRatio: '4/3' }}><img src={e.image} alt={e.title} /></div>}
            <div><span className="pill">{e.category}</span><h2 className="h-lg" style={{ margin: '16px 0' }}>{e.title}</h2>
              <p className="lede">{fmtEventDate(e.date)} · {e.time}</p><p style={{ margin: '6px 0 16px', color: 'var(--muted)' }}>{e.venue}</p>
              <p style={{ marginBottom: 16 }}>{e.summary}</p>
              {e.fee && <p><b>Fee:</b> {e.fee}</p>}{e.contact && <p><b>{e.registration ? 'Enquiries' : 'Register'}:</b> {e.contact}</p>}
              {e.registration && <div id="register"><RegistrationForm slug={e.slug} title={e.title} /></div>}</div>
          </div>)) : (
          <div className="card" style={{ marginTop: 28 }}><div className="pad" style={{ padding: 36 }}>
            <h3 className="h-md">No special events scheduled <em>right now</em>.</h3>
            <p style={{ marginTop: 12 }}>Join us for our Sunday service at 8:30 AM, and house church on Wednesdays at 6:30 PM. Follow us on <a href={SITE.facebook} target="_blank" rel="noopener">Facebook</a> for announcements.</p>
          </div></div>)}
      </div></section>
    </>
  );
}
