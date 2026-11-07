import PageHead from '@/components/PageHead';
import type { Metadata } from 'next';
import { SITE } from '@/lib/site';
export const metadata: Metadata = { title: 'Privacy' };
export default function Privacy() {
  return (
    <>
      <PageHead eyebrow="Policy" title={<>Privacy</>} />
      <section className="section tight"><div className="container" style={{ maxWidth: 780, display: 'grid', gap: 16 }}>
        <p>When you send us a message through this website, we use your name, contact details and message only to reply to you. We do not sell or share your details.</p>
        <p>When you play or download a sermon, we count the play or download so we know which messages are helpful. We do not record who you are.</p>
        <p>To ask about or remove your information, contact us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </div></section>
    </>
  );
}
