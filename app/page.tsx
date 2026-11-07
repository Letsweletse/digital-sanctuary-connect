import Link from 'next/link';
import Countdown from '@/components/Countdown';
import { SITE } from '@/lib/site';

// Wording and images on this page match the current live homepage word for word.
const FEATURED = {
  title: 'Couples Picnic',
  date: '2026-09-19',
  dateLabel: 'September 19, 2026',
  time: '09:30 (arrival) - 10:00 (start)',
  location: "Ditlhareng Estate Gabane (Taylor's Place)",
  description: "Join us for a Couples Picnic. Registration Fee: P60 per couple. Bring: pen, notebook, picnic basket for two, picnic blanket or chairs. Picnic lunch ideas: ready cooked meat/chicken/sausage (no braai fires), finger foods (sliced fruits or vegetables), sandwiches, cold drinks. Tea, coffee and water will be provided. WhatsApp: +267 72171066.",
  image: '/img/couples-picnic-2026.jpg',
  fee: 'P60',
};

const ico = {
  book: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>,
  home: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  users: <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
};

export default function Home() {
  const wa = `https://wa.me/26772171066?text=${encodeURIComponent(`Hello, I would like to register for the ${FEATURED.title} (${FEATURED.dateLabel}).`)}`;
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container split hero-split">
          <div>
            <span className="badge fade">Welcome to Gate Gaborone</span>
            <h1 className="h-xl fade" style={{ animationDelay: '.08s' }}>Gate <em>Gaborone</em></h1>
            <p className="lede fade" style={{ animationDelay: '.16s' }}>An apostolic center in the heart of Botswana&apos;s economic capital, strategically positioned to align with biblical patterns and model the Kingdom of God.</p>
            <div className="actions fade" style={{ animationDelay: '.24s' }}>
              <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-dark">Watch Live</a>
              <Link href="/sermons" className="btn">Sermon Archive</Link>
              <Link href="/events" className="btn">Upcoming Events</Link>
            </div>
          </div>
          <div className="framed fade" style={{ animationDelay: '.2s' }}>
            <img src="/img/kobus-and-wife.jpg" alt="Pastor Kobus Bezuidenhout and his wife" />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section white">
        <div className="container split">
          <div className="photo" style={{ aspectRatio: '4/3.4' }}><img src="/img/gaborone-city.jpg" alt="Gaborone, Botswana" /></div>
          <div>
            <p className="eyebrow">About</p>
            <h2 className="h-lg" style={{ margin: '18px 0 24px' }}>Gate Gaborone</h2>
            <div className="prose">
              <p>Gate Gaborone, as part of the Gate Family of churches, was birthed through a divine mandate given in a conference in 2012. The directive was unequivocally simple and clear — a new season has dawned upon the church that must visibly announce and tangibly express itself through congregations strategically positioned in gateway cities globally.</p>
              <p>This season, named in some circles as the &apos;apostolic season&apos;, was born at least two decades ago in relative obscurity and insignificance. Through this period of time, it has endured the rigorous process of spiritual and physical formation before presenting itself as a fresh biblical paradigm distinct from that of its Pentecostal/ Charismatic counterparts.</p>
              <p>At the heart of this season is the passionate pursuit to align the church to apostolic biblical patterns, free from conformity to secular and humanistic influences. GGB serves as an apostolic center in the heart of the economic capital of Botswana. Its mandate is to be a strategic gate for the presentation, proclamation, and modeling of the apostolic message to the nations.</p>
              <p>In pursuit of its mandate, Gate Gaborone seeks to constructively and practically provide a biblical, Christocentric model of ministry, offering a deeper spiritual encounter for the family of God.</p>
            </div>
            <div className="sig">
              <img src="/img/kobus-bezuidenhout.jpg" alt="Pastor Kobus Bezuidenhout" />
              <div><h4>Pastor Kobus Bezuidenhout</h4><p>Senior Pastor</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured event */}
      <section className="section dark feat">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 34 }}>
            <span className="feat-tag">{FEATURED.title}</span>
            <h2 className="h-lg" style={{ margin: '18px 0 10px' }}>Reach • Resource • Reform</h2>
            <p className="lede" style={{ margin: '0 auto', maxWidth: 760 }}>Registration is compulsory. WhatsApp +267 72171066 or email otenggate@gmail.com for assistance.</p>
          </div>
          <Countdown target={`${FEATURED.date}T09:30:00+02:00`} />
          <div className="feat-card">
            <div className="feat-img"><img src={FEATURED.image} alt={FEATURED.title} /></div>
            <div className="feat-body">
              <h3>{FEATURED.title}</h3>
              <div className="feat-meta">
                <div><span>Date</span><b>{FEATURED.dateLabel}</b></div>
                <div><span>Venue</span><b>{FEATURED.location}</b></div>
              </div>
              <p className="feat-k">Event Time</p>
              <div className="feat-box">{FEATURED.time}</div>
              <div className="feat-fee">
                <div><b>Registration Fee</b><span>Payable per couple</span></div>
                <div style={{ textAlign: 'right' }}><strong>{FEATURED.fee}</strong><span>Per couple</span></div>
              </div>
              <p className="feat-desc">{FEATURED.description}</p>
              <div className="actions">
                <a href={wa} target="_blank" rel="noopener" className="btn btn-blue">REGISTER NOW</a>
                <Link href="/events" className="btn btn-glass">View Full Details</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get connected */}
      <section className="section beige">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p className="eyebrow c">Explore More</p>
            <h2 className="h-lg" style={{ margin: '18px 0 14px' }}>Get Connected</h2>
            <p className="lede" style={{ margin: '0 auto', maxWidth: 640 }}>Discover different ways to get involved and grow in your faith journey at Gate Gaborone Ministries.</p>
          </div>
          <div className="grid g3">
            {[
              ['book', 'Sermons', "Watch and listen to our latest teachings to grow in your understanding of God's Word.", '/sermons', 'Browse Sermons'],
              ['home', 'House Church', 'Join our small group ministry for fellowship, prayer, and deeper Bible study in a home setting.', '/house-church', 'Find a Group'],
              ['users', 'Leadership', 'Meet the leadership team that guides our church family with wisdom, vision and a heart for God.', '/leadership', 'Meet the Team'],
            ].map(([k, t, d, href, cta]) => (
              <div key={t} className="card conn">
                <div className="conn-top"><div className="conn-ico">{ico[k as keyof typeof ico]}</div><h3>{t}</h3></div>
                <div className="pad"><p style={{ marginBottom: 20 }}>{d}</p><Link href={href} className="btn btn-sm">{cta}</Link></div>
              </div>))}
          </div>
        </div>
      </section>
    </>
  );
}
