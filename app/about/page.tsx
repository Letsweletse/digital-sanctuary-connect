import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import Cta from '@/components/Cta';
import { VALUES } from '@/lib/site';
export const metadata: Metadata = { title: 'About', description: 'The story, mission and values of Gate Gaborone.' };
export default function About() {
  return (
    <>
      <PageHead eyebrow="About us" title={<>Our <em>story</em>.</>} lede="Gate Gaborone is part of the Gate Family of churches: an apostolic centre in the heart of Botswana’s economic capital." />
      <section className="section"><div className="container split">
        <div>
          <p className="eyebrow">Who we are</p>
          <h2 className="h-lg" style={{ margin: '22px 0 24px' }}>Born from a <em>divine</em> mandate.</h2>
          <p style={{ marginBottom: 16 }}>Gate Gaborone was birthed through a divine mandate given at a conference in <b>2012</b>. The directive was simple and clear: a new season has dawned upon the church, and it must visibly announce and tangibly express itself through congregations strategically positioned in <b>gateway cities</b> around the world.</p>
          <p style={{ marginBottom: 16 }}>This season, called by some the “apostolic season”, was born more than two decades ago in relative obscurity. Through years of spiritual and practical formation, it has emerged as a fresh biblical paradigm, distinct from its Pentecostal and Charismatic counterparts.</p>
          <p>Its heart is a passionate pursuit to align the church with apostolic biblical patterns, free from conformity to secular and humanistic influences. Our mandate is to be a strategic gate for the presentation, proclamation and modelling of the apostolic message to the nations.</p>
        </div>
        <div className="photo"><img src="/img/congregation.jpg" alt="The congregation at Gate Gaborone" style={{ objectPosition: '60% 50%' }} /></div>
      </div></section>
      <section className="stats"><div className="container grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 60 }}>
        <div><span style={{ marginTop: 0, marginBottom: 16 }}>Our mission</span><p className="quote">To help people experience God’s <em className="em">grace</em>, grow in faith, and discover their purpose through Jesus Christ.</p></div>
        <div><span style={{ marginTop: 0, marginBottom: 16 }}>Our vision</span><p className="quote">To be a community where lives are transformed by God’s love, creating a movement of grace that impacts our <em className="em">city</em> and beyond.</p></div>
      </div></section>
      <section className="section beige"><div className="container">
        <p className="eyebrow">Our values</p>
        <h2 className="h-lg" style={{ margin: '22px 0 40px' }}>What we <em>hold</em> to.</h2>
        <div className="numgrid">{VALUES.map((v, i) => (
          <div key={v}><span className="n">0{i + 1}</span><h3>{v.charAt(0).toUpperCase() + v.slice(1)}</h3></div>))}
          <div style={{ background: 'var(--ink)', color: '#fff' }}><span className="n">→</span><h3 style={{ color: '#fff' }}>Come and see</h3><p style={{ color: '#cfc7bb' }}>Sundays at 8:30 AM.</p></div></div>
      </div></section>
      <Cta />
    </>
  );
}
