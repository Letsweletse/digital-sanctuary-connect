import type { Metadata } from 'next';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import { HOUSE_CHURCHES, SITE } from '@/lib/site';
export const metadata: Metadata = { title: 'House Church', description: 'Midweek house churches across Gaborone every Wednesday at 6:30 PM.' };
export default function HouseChurch() {
  return (
    <>
      <PageHead eyebrow="Small groups" title={<>{HOUSE_CHURCHES.length} homes. <em>One</em> family.</>} lede="Faith grows in community. Every Wednesday at 6:30 PM, house churches meet in homes across Gaborone for fellowship, prayer and Bible study." />
      <section className="section"><div className="container">
        <div className="numgrid">
          {HOUSE_CHURCHES.map((h, i) => (
            <div key={h.hosts}><span className="n">{String(i + 1).padStart(2, '0')} · {h.area}</span><h3>{h.hosts}</h3><p>{h.blurb}</p><p style={{ marginTop: 10, color: 'var(--ink)', fontWeight: 500 }}>Wednesdays · 6:30 PM</p>
              <Link className="more" href="/contact?subject=House%20Church">Ask to join →</Link></div>))}
          <div style={{ background: 'var(--ink)', color: '#fff' }}><span className="n">→</span><h3 style={{ color: '#fff' }}>Not sure which one?</h3><p style={{ color: '#cfc7bb' }}>Tell us where you live and we’ll connect you with the nearest group.</p>
            <a className="more" style={{ color: 'var(--gold)' }} href={`tel:${SITE.phoneAfterHours.replace(/\s/g, '')}`}>Call {SITE.phoneAfterHours} →</a></div>
        </div>
      </div></section>
    </>
  );
}
