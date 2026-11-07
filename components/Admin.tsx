'use client';
import { useEffect, useRef, useState } from 'react';
import type { Sermon } from '@/lib/sermons';

const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Gaborone' });
const lastSunday = () => { const d = new Date(today() + 'T12:00:00'); d.setDate(d.getDate() - d.getDay()); return d.toISOString().slice(0, 10); };

export function Login() {
  const [key, setKey] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  return (
    <form className="form card" style={{ maxWidth: 420, padding: 30 }} onSubmit={async e => {
      e.preventDefault(); setBusy(true); setErr('');
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ key }) });
      setBusy(false); if (r.ok) location.reload(); else setErr('Wrong password.');
    }}>
      <h2 className="h-md">Media team sign in</h2>
      <label>Password<input type="password" value={key} onChange={e => setKey(e.target.value)} autoFocus required /></label>
      {err && <p className="notice err">{err}</p>}
      <button className="btn btn-dark" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
    </form>
  );
}

export function Panel({ initial, speakers, ready }: { initial: Sermon[]; speakers: string[]; ready: { db: boolean; r2: boolean } }) {
  const [list, setList] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [dur, setDur] = useState<number | null>(null);
  const [pct, setPct] = useState(0); const [stage, setStage] = useState<'idle' | 'uploading' | 'saving' | 'done' | 'err'>('idle');
  const [msg, setMsg] = useState(''); const [link, setLink] = useState('');
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!file) { setDur(null); return; }
    const a = new Audio(); a.preload = 'metadata'; a.src = URL.createObjectURL(file);
    a.onloadedmetadata = () => { setDur(isFinite(a.duration) ? a.duration : null); URL.revokeObjectURL(a.src); };
  }, [file]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg(''); setLink('');
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      let key: string | null = null;
      if (file) {
        setStage('uploading'); setPct(0);
        const type = file.type || (file.name.toLowerCase().endsWith('.m4a') ? 'audio/mp4' : 'audio/mpeg');
        const r = await fetch('/api/admin/upload-url', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ filename: file.name, contentType: type, size: file.size, date: f.date }) });
        const j = await r.json(); if (!r.ok) throw new Error(j.error);
        await new Promise<void>((res, rej) => {
          const x = new XMLHttpRequest(); x.open('PUT', j.url); x.setRequestHeader('Content-Type', type);
          x.upload.onprogress = ev => ev.lengthComputable && setPct(Math.round(ev.loaded / ev.total * 100));
          x.onload = () => (x.status < 300 ? res() : rej(new Error(`Upload failed (${x.status}). Check the R2 CORS settings.`)));
          x.onerror = () => rej(new Error('Upload failed. Check your connection and the R2 CORS settings.')); x.send(file);
        });
        key = j.key;
      } else if (!f.youtube_url) throw new Error('Choose an audio file, or add a YouTube link.');
      setStage('saving');
      const r2 = await fetch('/api/admin/sermons', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...f, key, size: file?.size, duration: dur, mime: file?.type || null }) });
      const j2 = await r2.json(); if (!r2.ok) throw new Error(j2.error);
      setList([j2.sermon, ...list]); setStage('done'); setLink(`${location.origin}/sermons/${j2.sermon.slug}`);
      form.current?.reset(); setFile(null);
    } catch (err) { setStage('err'); setMsg((err as Error).message); }
  }

  async function patch(id: string, body: Record<string, unknown>) {
    const r = await fetch(`/api/admin/sermons/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json(); if (r.ok) setList(list.map(s => s.id === id ? j.sermon : s)); else alert(j.error);
  }
  async function remove(s: Sermon) {
    if (!confirm(`Delete “${s.title}” permanently? The audio file will be removed too. This cannot be undone.`)) return;
    const r = await fetch(`/api/admin/sermons/${s.id}`, { method: 'DELETE' }); if (r.ok) setList(list.filter(x => x.id !== s.id));
  }
  const wa = link ? `https://wa.me/?text=${encodeURIComponent(`🎧 This Sunday's message is now online. Listen or download:\n${link}`)}` : '';

  return (
    <div className="grid" style={{ gap: 40 }}>
      {!ready.r2 && <p className="notice err">Setup incomplete: Cloudflare R2 keys are not in Vercel yet, so uploads won’t work until they are added.</p>}
      <div className="card"><div className="pad" style={{ padding: 30 }}>
        <h2 className="h-md" style={{ marginBottom: 6 }}>Upload this Sunday’s message</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 22 }}>MP3 is best (about 30 MB per hour at 64 kbps). M4A from a phone also works.</p>
        <form ref={form} className="form" onSubmit={submit}>
          <label>Audio file<input type="file" accept="audio/*,.mp3,.m4a" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
          {file && <p className="meta">{file.name} · {(file.size / 1048576).toFixed(1)} MB{dur ? ` · ${Math.round(dur / 60)} min` : ''}{file.size > 150 * 1048576 ? ' · Large file: consider exporting as MP3 at 64–96 kbps' : ''}</p>}
          <div className="grid g2" style={{ gap: 16 }}>
            <label>Title<input name="title" required maxLength={140} placeholder="e.g. The Wisdom of God" /></label>
            <label>Speaker<input name="speaker" required list="speakers" defaultValue="Pastor Kobus Bezuidenhout" /><datalist id="speakers">{speakers.map(s => <option key={s} value={s} />)}</datalist></label>
            <label>Date preached<input name="date" type="date" required defaultValue={lastSunday()} /></label>
            <label>Series (optional)<input name="series" defaultValue="Sunday Service" /></label>
            <label>Scripture (optional)<input name="scripture" placeholder="e.g. Proverbs 3:13–18" /></label>
            <label>YouTube link (optional)<input name="youtube_url" type="url" placeholder="https://youtube.com/watch?v=…" /></label>
          </div>
          <label>Short description (optional)<textarea name="description" maxLength={1200} style={{ minHeight: 90 }} /></label>
          {stage === 'uploading' && <div><div style={{ height: 8, background: 'var(--cream)', borderRadius: 9 }}><div style={{ width: `${pct}%`, height: 8, background: 'var(--gold)', borderRadius: 9, transition: '.2s' }} /></div><p className="meta" style={{ marginTop: 6 }}>Uploading… {pct}% (keep this page open)</p></div>}
          {stage === 'saving' && <p className="meta">Saving…</p>}
          {stage === 'err' && <p className="notice err">{msg}</p>}
          {stage === 'done' && <div className="notice ok">Published. Share it: <a href={link} target="_blank" rel="noopener">{link}</a>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}><a className="iconbtn wa" href={wa} target="_blank" rel="noopener">Share on WhatsApp</a>
              <button type="button" className="iconbtn" onClick={() => navigator.clipboard.writeText(link)}>Copy link</button></div></div>}
          <button className="btn btn-dark" disabled={stage === 'uploading' || stage === 'saving'} style={{ justifySelf: 'start' }}>Publish message</button>
        </form>
      </div></div>

      <div>
        <h2 className="h-md" style={{ marginBottom: 10 }}>All messages ({list.length})</h2>
        {list.map(s => (
          <div key={s.id} className="srm" style={{ gridTemplateColumns: '1fr auto' }}>
            <div style={{ minWidth: 0 }}>
              <div className="meta"><span>{s.preached_on}</span><span>{s.speaker}</span><span>{s.audio_url ? 'Audio' : 'YouTube only'}</span><span>{s.plays} plays · {s.downloads} downloads</span>{!s.published && <span style={{ color: '#8a1f1f' }}>Hidden</span>}</div>
              <h3 style={{ fontSize: 22 }}><a href={`/sermons/${s.slug}`} target="_blank" rel="noopener">{s.title}</a></h3>
            </div>
            <div className="acts">
              <button className="iconbtn" onClick={() => { const t = prompt('Title', s.title); if (t && t !== s.title) patch(s.id, { title: t }); }}>Rename</button>
              <button className="iconbtn" onClick={() => patch(s.id, { published: !s.published })}>{s.published ? 'Hide' : 'Show'}</button>
              <button className="iconbtn" style={{ color: '#8a1f1f' }} onClick={() => remove(s)}>Delete</button>
            </div>
          </div>))}
      </div>
      <p><button className="btn btn-line btn-sm" onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); location.reload(); }}>Sign out</button></p>
    </div>
  );
}
