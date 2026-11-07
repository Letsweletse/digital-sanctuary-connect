'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Registration, Pledge } from '@/lib/registrations';
import type { NetworkPost } from '@/lib/network';
import { upload } from '@vercel/blob/client';

export function AdminTabs({ sermons }: { sermons: React.ReactNode }) {
  const [tab, setTab] = useState<'sermons' | 'conferences' | 'registrations' | 'pledges'>('sermons');
  return (
    <>
      <div className="tabs">
        {(['sermons', 'conferences', 'registrations', 'pledges'] as const).map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}
      </div>
      <div style={{ display: tab === 'sermons' ? 'block' : 'none' }}>{sermons}</div>
      {tab === 'conferences' && <ConferencesTab />}
      {(tab === 'registrations' || tab === 'pledges') && <DataTab kind={tab} />}
    </>
  );
}

function DataTab({ kind }: { kind: 'registrations' | 'pledges' }) {
  const [data, setData] = useState<{ registrations: Registration[]; pledges: Pledge[]; imported: boolean } | null>(null);
  const [err, setErr] = useState(''); const [q, setQ] = useState(''); const [ev, setEv] = useState(''); const [busy, setBusy] = useState(false);
  const load = () => fetch('/api/admin/registrations').then(async r => { const j = await r.json(); if (r.ok) setData(j); else setErr(j.error); });
  useEffect(() => { load(); }, []);
  const events = useMemo(() => {
    const m = new Map<string, { n: number; people: number; date: string }>();
    data?.registrations.forEach(r => { const x = m.get(r.event) || { n: 0, people: 0, date: r.event_date }; x.n++; x.people += r.attendees || 1; m.set(r.event, x); });
    return [...m.entries()].sort((a, b) => (b[1].date || '').localeCompare(a[1].date || ''));
  }, [data]);
  if (err) return <p className="notice err">{err}</p>;
  if (!data) return <p className="meta">Loading…</p>;
  const needle = q.trim().toLowerCase();
  const match = (o: object) => !needle || Object.values(o).join(' ').toLowerCase().includes(needle);
  const importOld = async () => {
    setBusy(true); const r = await fetch('/api/admin/import-old', { method: 'POST' }); const j = await r.json(); setBusy(false);
    if (r.ok) { alert(`Imported ${j.registrations} registrations and ${j.pledges} pledges from the old website.`); load(); } else alert(j.error);
  };
  const csv = (extra = '') => `/api/admin/registrations?format=csv&kind=${kind}${extra}`;
  return (
    <div>
      {!data.imported && <div className="notice info" style={{ marginBottom: 18 }}>Records from the old website have not been imported yet.
        <button className="btn btn-sm" style={{ marginLeft: 12 }} disabled={busy} onClick={importOld}>{busy ? 'Importing…' : 'Import from old website'}</button></div>}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Search name, email, phone, church…" value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, minWidth: 220, padding: '10px 14px', border: '1px solid var(--line)', borderRadius: 10, font: 'inherit' }} />
        <a className="btn btn-sm" href={csv(ev ? `&event=${encodeURIComponent(ev)}` : '')}>Download Excel (CSV)</a>
      </div>
      {kind === 'registrations' ? <>
        <div className="grid g3" style={{ gap: 12, marginBottom: 18 }}>
          <button className={`card ${ev === '' ? 'soft' : ''}`} style={{ textAlign: 'left', padding: 16, cursor: 'pointer', border: ev === '' ? '2px solid var(--gold)' : undefined }} onClick={() => setEv('')}>
            <b>All events</b><p className="meta">{data.registrations.length} registrations</p></button>
          {events.map(([name, x]) => (
            <button key={name} className="card" style={{ textAlign: 'left', padding: 16, cursor: 'pointer', border: ev === name ? '2px solid var(--gold)' : undefined }} onClick={() => setEv(name)}>
              <b>{name}</b><p className="meta">{x.n} registrations · {x.people} people{x.date ? ` · ${x.date.slice(0, 10)}` : ''}</p></button>))}
        </div>
        <div style={{ overflowX: 'auto' }}><table className="tbl"><thead><tr><th>Date</th><th>Name</th><th>Contact</th><th>Role / church</th><th>#</th><th>Event</th></tr></thead><tbody>
          {data.registrations.filter(r => (!ev || r.event === ev) && match(r)).map(r => (
            <tr key={r.id}><td>{r.created_at.slice(0, 10)}</td><td>{r.title} {r.name}{r.message && <div className="meta">{r.message}</div>}</td>
              <td>{r.email}<br />{r.phone}</td><td>{r.role}<br />{r.church}</td><td>{r.attendees}</td><td>{r.event}{r.source === 'old-site' && <div className="meta">old site</div>}</td></tr>))}
        </tbody></table></div>
      </> : (
        <div style={{ overflowX: 'auto' }}><table className="tbl"><thead><tr><th>Date</th><th>Name</th><th>Contact</th><th>Amount</th><th>Event</th><th>Message</th></tr></thead><tbody>
          {data.pledges.filter(match).map(p => (
            <tr key={p.id}><td>{p.created_at.slice(0, 10)}</td><td>{p.name}</td><td>{p.email}<br />{p.phone}</td><td>{p.currency} {p.amount.toLocaleString()}</td><td>{p.event}</td><td>{p.message}</td></tr>))}
          {!data.pledges.length && <tr><td colSpan={6} className="meta">No pledges yet.</td></tr>}
        </tbody></table>
        <p className="meta" style={{ marginTop: 10 }}>Total pledged: {Object.entries(data.pledges.reduce<Record<string, number>>((a, p) => { a[p.currency] = (a[p.currency] || 0) + p.amount; return a; }, {})).map(([c, v]) => `${c} ${v.toLocaleString()}`).join(' · ') || '0'}</p></div>
      )}
    </div>
  );
}

function ConferencesTab() {
  const [posts, setPosts] = useState<NetworkPost[] | null>(null); const [busy, setBusy] = useState(''); const [err, setErr] = useState('');
  const load = () => fetch('/api/admin/network').then(r => r.json()).then(j => setPosts(j.posts || []));
  useEffect(() => { load(); }, []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(''); const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string | File>;
    try {
      let image: string | null = null; const file = f.flyer as File;
      if (file && file.size) { setBusy('Uploading flyer…'); image = (await upload(`conferences/${Date.now()}-${file.name.replace(/[^\w.]+/g, '-')}`, file, { access: 'public', handleUploadUrl: '/api/admin/blob' })).url; }
      setBusy('Saving…'); delete f.flyer;
      const r = await fetch('/api/admin/network', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...f, image }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error);
      form.reset(); load();
    } catch (x) { setErr((x as Error).message); } finally { setBusy(''); }
  }
  return (
    <div>
      <div className="card"><div className="pad" style={{ padding: 28 }}>
        <h2 className="h-md" style={{ marginBottom: 6 }}>Share a conference or live stream</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 18 }}>It appears on the Conferences page straight away. Add a YouTube link, a flyer, or both.</p>
        <form className="form" onSubmit={submit}>
          <div className="grid g2" style={{ gap: 14 }}>
            <label>Conference name<input name="title" required placeholder="e.g. ASOM 2026" /></label>
            <label>Session (optional)<input name="session" placeholder="e.g. Day 2 · Evening Session" /></label>
            <label>Place<input name="location" placeholder="e.g. Santiago, Dominican Republic" /></label>
            <label>Hosted by (optional)<input name="host" placeholder="e.g. Fountain Gate Church" /></label>
            <label>Start date<input name="start" type="date" required defaultValue={new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Gaborone' })} /></label>
            <label>End date (optional)<input name="end" type="date" /></label>
            <label>YouTube / live link (optional)<input name="youtube_url" type="url" placeholder="https://youtu.be/…" /></label>
            <label>Flyer image (optional)<input name="flyer" type="file" accept="image/*" /></label>
          </div>
          <label>Details (optional)<textarea name="details" maxLength={1500} style={{ minHeight: 80 }} placeholder="Speakers, schedule, contact numbers…" /></label>
          {err && <p className="notice err">{err}</p>}
          <button className="btn btn-dark" disabled={!!busy} style={{ justifySelf: 'start' }}>{busy || 'Publish'}</button>
        </form>
      </div></div>
      <h2 className="h-md" style={{ margin: '30px 0 10px' }}>Shared ({posts?.length ?? 0})</h2>
      {posts?.map(p => (
        <div key={p.id} className="srm" style={{ gridTemplateColumns: '1fr auto' }}>
          <div><div className="meta"><span>{p.start}{p.end ? ` – ${p.end}` : ''}</span><span>{p.location}</span><span>{p.youtube_url ? 'Video' : p.image ? 'Flyer' : 'Link'}</span></div>
            <h3 style={{ fontSize: 20 }}>{p.title}{p.session ? ` – ${p.session}` : ''}</h3></div>
          <div className="acts"><button className="iconbtn" style={{ color: '#8a1f1f' }} onClick={async () => { if (confirm(`Remove “${p.title}” from the website?`)) { await fetch(`/api/admin/network?id=${p.id}`, { method: 'DELETE' }); load(); } }}>Remove</button></div>
        </div>))}
    </div>
  );
}
