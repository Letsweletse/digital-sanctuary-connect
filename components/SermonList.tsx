'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import SermonActions from './SermonActions';
import type { Sermon } from '@/lib/sermons';

const fmtDate = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtDur = (s: number | null) => { if (!s) return ''; const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? `${h} h ${m} min` : `${m} min`; };

export default function SermonList({ sermons, siteUrl }: { sermons: Sermon[]; siteUrl: string }) {
  const [q, setQ] = useState(''); const [sp, setSp] = useState(''); const [yr, setYr] = useState('');
  const speakers = useMemo(() => [...new Set(sermons.map(s => s.speaker))].sort(), [sermons]);
  const years = useMemo(() => [...new Set(sermons.map(s => s.preached_on.slice(0, 4)))].sort().reverse(), [sermons]);
  const list = sermons.filter(s =>
    (!sp || s.speaker === sp) && (!yr || s.preached_on.startsWith(yr)) &&
    (!q || `${s.title} ${s.speaker} ${s.series ?? ''} ${s.scripture ?? ''} ${s.description ?? ''}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <div className="filters">
        <input placeholder="Search by title, speaker or scripture" value={q} onChange={e => setQ(e.target.value)} aria-label="Search sermons" />
        <select value={sp} onChange={e => setSp(e.target.value)} aria-label="Speaker"><option value="">All speakers</option>{speakers.map(s => <option key={s}>{s}</option>)}</select>
        <select value={yr} onChange={e => setYr(e.target.value)} aria-label="Year"><option value="">All years</option>{years.map(y => <option key={y}>{y}</option>)}</select>
      </div>
      <p className="meta" style={{ marginBottom: 6 }}>{list.length} {list.length === 1 ? 'message' : 'messages'}</p>
      <div>
        {list.map(s => (
          <article className="srm" key={s.id}>
            <Link href={`/sermons/${s.slug}`} className="thumb" aria-hidden tabIndex={-1}>
              <img src={s.cover_image || '/img/kobus-portrait.jpg'} alt="" loading="lazy" />
            </Link>
            <div style={{ minWidth: 0 }}>
              <div className="meta"><span>{fmtDate(s.preached_on)}</span>{s.series && <span>{s.series}</span>}{s.duration_seconds ? <span>{fmtDur(s.duration_seconds)}</span> : null}</div>
              <h3><Link href={`/sermons/${s.slug}`}>{s.title}</Link></h3>
              <div className="meta"><span style={{ color: 'var(--text)', fontWeight: 600 }}>{s.speaker}</span>{s.scripture && <span>{s.scripture}</span>}</div>
            </div>
            <SermonActions s={s} siteUrl={siteUrl} compact />
          </article>
        ))}
        {!list.length && <p className="lede" style={{ padding: '40px 0' }}>No messages match your search.</p>}
      </div>
    </>
  );
}
