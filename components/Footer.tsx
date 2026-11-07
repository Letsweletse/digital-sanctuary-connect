import Link from 'next/link';
import { SITE } from '@/lib/site';

// Footer wording matches the current live site.
export default function Footer() {
  return (
    <footer className="ftr">
      <div className="container">
        <div className="cols">
          <div>
            <img src="/img/logo-wordmark.png" alt="Gate Gaborone" style={{ height: 24, width: 'auto', marginBottom: 20 }} />
            <p style={{ maxWidth: 320 }}>An apostolic center in the heart of Botswana&apos;s economic capital, strategically positioned to align with biblical patterns.</p>
            <p style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <a href={SITE.facebook} target="_blank" rel="noopener">Facebook</a>
              <a href={SITE.youtube} target="_blank" rel="noopener">YouTube</a>
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/sermons">Sermons</Link></li>
              <li><Link href="/events">Events Calendar</Link></li>
              <li><Link href="/leadership">Our Leadership</Link></li>
              <li><Link href="/house-church">House Church</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4>Service Times</h4>
            <ul>
              <li><span style={{ color: '#fff' }}>Sunday Services</span><br />8:30 AM &amp; 11:00 AM</li>
              <li><span style={{ color: '#fff' }}>Wednesday Housechurch</span><br />6:30 PM - 8:00 PM</li>
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <ul>
              <li><span style={{ color: '#fff' }}>Address:</span><br />Gate Gaborone Auditorium<br />Gaborone West, Phase 4, Plot 54014</li>
              <li><span style={{ color: '#fff' }}>Phone:</span><br /><a href="tel:+2673500194">+267 3500194</a> / <a href="tel:+26775507981">+267 75507981</a></li>
              <li><span style={{ color: '#fff' }}>Email:</span><br /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="base">
          <span>© {new Date().getFullYear()} Gate Gaborone. All rights reserved.</span>
          <span style={{ display: 'flex', gap: 22 }}><Link href="/privacy">Privacy Policy</Link><Link href="/privacy">Terms of Service</Link></span>
        </div>
      </div>
    </footer>
  );
}
