import Link from 'next/link';
import SermonActions from '@/components/SermonActions';
import Cta from '@/components/Cta';
import { listSermons, fmtDate } from '@/lib/sermons';
import { upcoming, fmtEventDate } from '@/lib/events';
import { SITE, LEADERS, HOUSE_CHURCHES } from '@/lib/site';

export const revalidate = 60;

const I = {
  reach: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></svg>,
  book: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16" /></svg>,
  crown: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z" /></svg>,
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" /></svg>,
};

export default async function Home() {
  const sermons = await listSermons();
  const latest = sermons.find(s => s.audio_url) || sermons[0];
  const next = upcoming()[0];
  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="badge fade">Gaborone West · Sundays 8:30 AM · All welcome</span>
          <h1 className="h-xl fade" style={{ animationDelay: '.08s' }}>Gate Gaborone<br /><em>Botswana</em></h1>
          <p className="lede fade" style={{ animationDelay: '.16s' }}>Gate Gaborone is an apostolic centre in the heart of Botswana’s economic capital, part of the <b>Gate Global Family</b>, committed to aligning the church with biblical patterns and modelling the <b>Kingdom of God</b>.</p>
          <div className="actions fade" style={{ animationDelay: '.24s' }}>
            <Link href="/contact" className="btn btn-dark">Plan your visit</Link>
            <Link href="/sermons" className="btn">Sunday messages</Link>
            <Link href="/house-church" className="btn">House churches</Link>
          </div>
          <div className="facts fade" style={{ animationDelay: '.32s' }}>
            <div><span>Sunday service</span><b>8:30 AM</b></div>
            <div><span>House church</span><b>Wednesdays, 6:30 PM</b></div>
            <div><span>Venue</span><b>Plot 54014, Gaborone West</b></div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container grid">
          <div><b>2012</b><span>The mandate is given</span></div>
          <div><b>15+</b><span>Years of pastoral leadership</span></div>
          <div><b>{HOUSE_CHURCHES.length}</b><span>House churches</span></div>
          <div><b>8:30</b><span>Sunday service</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container split top">
          <div>
            <p className="eyebrow">About Gate Gaborone</p>
            <h2 className="h-lg" style={{ marginTop: 22 }}>Built for a city where <em>nations</em> meet.</h2>
          </div>
          <div>
            <p style={{ marginBottom: 16 }}>Gate Gaborone was birthed through a divine mandate given at a conference in 2012: a new season has dawned upon the church, one that must visibly and tangibly express itself through congregations positioned in <b>gateway cities</b> across the world.</p>
            <p style={{ marginBottom: 30 }}>For more than <b>15 years</b>, our leaders have pursued one thing: a church aligned with apostolic, biblical patterns, offering a Christ-centred model of ministry and a deeper encounter with God.</p>
            <div className="grid g2" style={{ gap: 14 }}>
              {[['reach', 'Reach', 'Taking the message of the Kingdom to our city and the nations.'],
                ['book', 'Resource', 'Sound apostolic teaching that equips believers for every sphere of life.'],
                ['crown', 'Reform', 'Modelling the Kingdom so lives, families and communities are transformed.'],
                ['home', 'Family', 'Midweek house churches where faith grows in real community.']].map(([k, t, d]) => (
                <div key={t} className="card soft"><div className="pad" style={{ padding: 22 }}><div className="icon">{I[k as keyof typeof I]}</div><h3>{t}</h3><p>{d}</p></div></div>))}
            </div>
          </div>
        </div>
      </section>

      {latest && (
        <section className="section beige">
          <div className="container split">
            <div>
              <p className="eyebrow">Latest message</p>
              <h2 className="h-lg" style={{ margin: '22px 0 14px' }}>{latest.title.split(' ').slice(0, -1).join(' ')} <em>{latest.title.split(' ').slice(-1)}</em></h2>
              <p className="lede" style={{ marginBottom: 28 }}>{latest.speaker} · {fmtDate(latest.preached_on)}</p>
              <SermonActions s={latest} siteUrl={SITE.url} left />
              <div className="rule" />
              <p style={{ color: 'var(--muted)', maxWidth: 520 }}>Missed Sunday? Every message is added to the library, so you can listen online, download it for later, or share it on WhatsApp.</p>
              <p style={{ marginTop: 22 }}><Link className="btn btn-sm" href="/sermons">All messages</Link></p>
            </div>
            <div className="photo" style={{ aspectRatio: '1/1' }}><img src={latest.cover_image || '/img/kobus-portrait.jpg'} alt={latest.speaker} /></div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <p className="eyebrow">Get connected</p>
          <h2 className="h-lg" style={{ margin: '22px 0 40px' }}>How to <em>belong</em> here.</h2>
          <div className="steps">
            {[['Visit on a Sunday', 'Join us at 8:30 AM at the Gate Gaborone Auditorium, Plot 54014, Gaborone West. Come as you are.'],
              ['Join a house church', `Every Wednesday at 6:30 PM, ${HOUSE_CHURCHES.length} groups meet in homes across Gaborone for fellowship, prayer and Bible study.`],
              ['Listen and share', 'Catch up on every Sunday message online, download it for the road, or send it to a friend on WhatsApp.'],
              ['Grow and serve', 'Discover your purpose through Jesus Christ and serve alongside a church family committed to the Kingdom.']].map(([t, d], i) => (
              <div key={t}><span className="n">0{i + 1}</span><div><h3>{t}</h3><p>{d}</p></div></div>))}
          </div>
        </div>
      </section>

      {next && (
        <section className="section white">
          <div className="container split">
            {next.image && <div className="photo" style={{ aspectRatio: '4/3' }}><img src={next.image} alt={next.title} /></div>}
            <div>
              <p className="eyebrow">Coming up · {next.category}</p>
              <h2 className="h-lg" style={{ margin: '22px 0 16px' }}>{next.title}</h2>
              <p className="lede" style={{ marginBottom: 8 }}>{fmtEventDate(next.date)} · {next.time}</p>
              <p style={{ color: 'var(--muted)', marginBottom: 26 }}>{next.venue}</p>
              <Link className="btn btn-dark" href="/events">Event details</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section beige">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, flexWrap: 'wrap' }}>
            <div><p className="eyebrow">Leadership</p><h2 className="h-lg" style={{ marginTop: 22 }}>Serving with <em>purpose</em>.</h2></div>
            <Link className="btn btn-sm" href="/leadership">Meet the team</Link>
          </div>
          <div className="grid g3" style={{ marginTop: 44 }}>
            {LEADERS.slice(0, 3).map(l => (
              <div key={l.name} className="card">
                <div style={{ aspectRatio: '4/4.4', overflow: 'hidden' }}><img src={l.img} alt={l.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                <div className="pad"><p className="pill">{l.role}</p><h3 style={{ marginTop: 12 }}>{l.name}</h3></div>
              </div>))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Across the city</p>
          <h2 className="h-lg" style={{ margin: '22px 0 14px' }}>{HOUSE_CHURCHES.length} homes. <em>One</em> church family.</h2>
          <p className="lede" style={{ marginBottom: 38 }}>Every Wednesday at 6:30 PM, house churches meet across Gaborone. There is one near you.</p>
          <div className="chips">
            {HOUSE_CHURCHES.map(h => <div key={h.hosts} className="chip"><span className="pill">{h.area}</span><h3>{h.hosts}</h3><p>Wednesdays · 6:30 PM</p></div>)}
            <Link href="/house-church" className="chip" style={{ textDecoration: 'none', background: 'var(--ink)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}><h3 style={{ color: '#fff' }}>Find your group <em>→</em></h3><p style={{ color: '#cfc7bb' }}>See all house churches</p></Link>
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
