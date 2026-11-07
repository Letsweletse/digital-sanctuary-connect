import type { Metadata } from 'next';
import QRCode from 'qrcode';
import PageHead from '@/components/PageHead';
import CopyRow from '@/components/CopyRow';
import { BANK, GIVING_TYPES, MISSION, VISION, SITE } from '@/lib/site';
export const metadata: Metadata = { title: 'Give', description: 'Give to Gate Gaborone: tithes, offerings, first fruits and donations by bank transfer.' };

export default async function Give() {
  const qrText = `Account Name: ${BANK.accountName}\nBank: ${BANK.bank}\nBranch: ${BANK.branchName}\nBranch Number: ${BANK.branchNumber}\nAccount Number: ${BANK.accountNumber}\nReference: Your name + Tithe/Offering`;
  const qr = await QRCode.toString(qrText, { type: 'svg', margin: 1, color: { dark: '#1a1714', light: '#ffffff' } });
  return (
    <>
      <PageHead eyebrow="Give" title={<>Give to the <em>church</em>.</>} lede="Your generosity helps us spread the Gospel and serve our community." />

      <section className="stats"><div className="container grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        <div><span style={{ marginTop: 0, marginBottom: 16 }}>Our mission</span><p className="quote">{MISSION}</p></div>
        <div><span style={{ marginTop: 0, marginBottom: 16 }}>Our vision</span><p className="quote">{VISION}</p></div>
      </div></section>

      <section className="section"><div className="container split top">
        <div>
          <p className="eyebrow">Giving options</p>
          <h2 className="h-lg" style={{ margin: '22px 0 26px' }}>Ways to <em>give</em>.</h2>
          <div className="grid g2" style={{ gap: 14 }}>
            {GIVING_TYPES.map(t => <div key={t} className="card soft"><div className="pad" style={{ padding: 22 }}><h3>{t}</h3></div></div>)}
          </div>
          <div className="card" style={{ marginTop: 26 }}><div className="pad" style={{ padding: 26 }}>
            <h3 style={{ marginBottom: 10 }}>How to give by bank transfer</h3>
            <ol style={{ paddingLeft: 20, color: 'var(--muted)', lineHeight: 1.9 }}>
              <li>Scan the QR code with your banking app, or enter the banking details.</li>
              <li>Use your name + “Tithe”, “Offering”, “First Fruits” or “Donation” as the reference.</li>
              <li>Transfer the amount you have set aside.</li>
            </ol>
            <p style={{ marginTop: 14, color: 'var(--muted)' }}>You can also give in person during the Sunday service at 8:30 AM. Questions? Call <a href={`tel:${SITE.phoneOffice.replace(/\s/g, '')}`}>{SITE.phoneOffice}</a>.</p>
          </div></div>
        </div>
        <div className="card"><div className="pad" style={{ padding: 30 }}>
          <p className="eyebrow">Banking details</p>
          <div className="bank-qr" dangerouslySetInnerHTML={{ __html: qr }} />
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, margin: '6px 0 18px' }}>Scan the QR code or use the details below</p>
          <CopyRow label="Account name" value={BANK.accountName} />
          <CopyRow label="Bank" value={BANK.bank} />
          <CopyRow label="Branch name" value={BANK.branchName} />
          <CopyRow label="Branch number" value={BANK.branchNumber} />
          <CopyRow label="Account number" value={BANK.accountNumber} />
        </div></div>
      </div></section>
    </>
  );
}
