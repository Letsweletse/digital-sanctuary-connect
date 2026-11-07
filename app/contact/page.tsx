import PageHead from '@/components/PageHead';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { SITE } from '@/lib/site';
export const metadata: Metadata = { title: 'Contact', description: 'Visit Gate Gaborone in Gaborone West, Phase 4, or send us a message.' };
export default async function Contact({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  return (
    <>
      <PageHead eyebrow="Get in touch" title={<>Plan your <em>visit</em>.</>} lede="We’d love to welcome you. Join us on Sunday, or send us a message and we’ll get back to you." />
      <section className="section"><div className="container split" style={{ alignItems: 'start' }}>
        <div>
          <p className="eyebrow">Find us</p>
          <h2 className="h-md" style={{ margin: '12px 0 10px' }}>{SITE.address[0]}</h2>
          <p style={{ color: 'var(--muted)' }}>{SITE.address.slice(1).join(', ')}</p>
          <p style={{ margin: '18px 0 30px' }}><a className="btn btn-sm" href={SITE.mapsUrl} target="_blank" rel="noopener">Open in Google Maps</a></p>
          <div className="rule" />
          {SITE.services.map(s => <p key={s.name} style={{ marginBottom: 10 }}><b>{s.name}</b><br /><span style={{ color: 'var(--muted)' }}>{s.day}s · {s.time}</span></p>)}
          <div className="rule" />
          <p style={{ marginBottom: 8 }}><b>Office</b> <a href={`tel:${SITE.phoneOffice.replace(/\s/g, '')}`}>{SITE.phoneOffice}</a></p>
          <p style={{ marginBottom: 8 }}><b>After hours</b> <a href={`tel:${SITE.phoneAfterHours.replace(/\s/g, '')}`}>{SITE.phoneAfterHours}</a></p>
          <p><b>Email</b> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        </div>
        <div className="card"><div className="pad" style={{ padding: 34 }}><h3 className="h-md" style={{ marginBottom: 20 }}>Send us a message</h3><ContactForm subject={subject} /></div></div>
      </div></section>
    </>
  );
}
