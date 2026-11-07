import PageHead from '@/components/PageHead';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GIVING, SITE } from '@/lib/site';
export const metadata: Metadata = { title: 'Give', description: 'Support the work of Gate Gaborone.' };
export default function Give() {
  return (
    <>
      <PageHead eyebrow="Generosity" title={<>Give <em>generously</em>.</>} lede="Your tithes and offerings help us spread the Gospel, care for people and serve our city. Thank you for your generosity." />
      <section className="section"><div className="container" style={{ maxWidth: 900 }}>
        {GIVING.length ? (
          <div className="grid g2">{GIVING.map(g => (
            <div key={g.label} className="card"><div className="pad" style={{ padding: 30 }}><p className="eyebrow">{g.label}</p>
              {g.lines.map(l => <p key={l} style={{ marginTop: 8, fontSize: 18 }}>{l}</p>)}</div></div>))}</div>
        ) : (
          <div className="card"><div className="pad" style={{ padding: 34 }}>
            <h2 className="h-md">Giving details</h2>
            <p style={{ color: 'var(--muted)', margin: '12px 0 22px' }}>You can give during our Sunday services. For bank transfer or mobile money details, please contact the church office.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-dark" href={`tel:${SITE.phoneOffice.replace(/\s/g, '')}`}>Call {SITE.phoneOffice}</a>
              <Link className="btn" href="/contact?subject=Other">Send a message</Link></div>
          </div></div>
        )}
        <p style={{ color: 'var(--muted)', marginTop: 28, fontSize: 15 }}>Please use your name and “Tithe” or “Offering” as the reference so we can record your gift.</p>
      </div></section>
    </>
  );
}
