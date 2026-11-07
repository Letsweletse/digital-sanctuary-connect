import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import Cta from '@/components/Cta';
import { LEADERS } from '@/lib/site';
export const metadata: Metadata = { title: 'Leadership', description: 'Meet the leaders who serve Gate Gaborone.' };
export default function Leadership() {
  const sp = LEADERS[0], rest = LEADERS.slice(1);
  return (
    <>
      <PageHead eyebrow="Our team" title={<>Serving with <em>purpose</em>.</>} lede="Dedicated servants who lead our church family with vision, wisdom and a heart for God’s people." />
      <section className="section"><div className="container split">
        <div className="photo"><img src={sp.img} alt={sp.name} /></div>
        <div><p className="eyebrow">Senior Pastor</p><h2 className="h-lg" style={{ margin: '22px 0 20px' }}>{sp.name.replace('Pastor ', '')}</h2><p className="lede">{sp.bio}</p></div>
      </div></section>
      <section className="section beige"><div className="container">
        <p className="eyebrow">Pastors &amp; elders</p>
        <h2 className="h-lg" style={{ margin: '22px 0 40px' }}>The <em>team</em>.</h2>
        <div className="grid g3">{rest.map(l => (
          <div key={l.name} className="card">
            <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}><img src={l.img} alt={l.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            <div className="pad"><span className="pill">{l.role}</span><h3 style={{ margin: '12px 0 8px' }}>{l.name}</h3><p>{l.bio}</p></div>
          </div>))}</div>
      </div></section>
      <Cta />
    </>
  );
}
