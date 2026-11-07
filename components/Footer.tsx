import Link from 'next/link';
import { SITE, NAV } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="container">
        <div className="cols">
          <div>
            <img src="/img/logo-wordmark.png" alt="Gate Gaborone" style={{ height: 24, width: 'auto', marginBottom: 20 }} />
            <p style={{ maxWidth: 320 }}>{SITE.description}</p>
            <p className="eyebrow" style={{ marginTop: 18 }}>{SITE.tagline}</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>{NAV.map(n => <li key={n.href}><Link href={n.href}>{n.label}</Link></li>)}<li><Link href="/give">Give</Link></li></ul>
          </div>
          <div>
            <h4>Gather</h4>
            <ul>{SITE.services.map(s => <li key={s.name}><span style={{ color: '#fff' }}>{s.name}</span><br />{s.day}s · {s.time}</li>)}</ul>
          </div>
          <div>
            <h4>Visit</h4>
            <ul>
              {SITE.address.map(a => <li key={a}>{a}</li>)}
              <li style={{ marginTop: 8 }}><a href={`tel:${SITE.phoneOffice.replace(/\s/g, '')}`}>{SITE.phoneOffice}</a> · <a href={`tel:${SITE.phoneAfterHours.replace(/\s/g, '')}`}>{SITE.phoneAfterHours}</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li style={{ display: 'flex', gap: 16, marginTop: 8 }}><a href={SITE.youtube} target="_blank" rel="noopener">YouTube</a><a href={SITE.facebook} target="_blank" rel="noopener">Facebook</a><a href="/podcast.xml">Podcast</a></li>
            </ul>
          </div>
        </div>
        <div className="base">
          <span>© {new Date().getFullYear()} Gate Gaborone. Part of the Gate Global Family.</span>
          <span><Link href="/privacy">Privacy</Link></span>
        </div>
      </div>
    </footer>
  );
}
