'use client';
import { useState } from 'react';
import { ATTENDEE_TITLES, ATTENDEE_ROLES, COUNTRY_CODES } from '@/lib/site';
export default function RegistrationForm({ slug, title }: { slug: string; title: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'err'>('idle'); const [msg, setMsg] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState('busy');
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch('/api/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...f, event: slug }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setState('done'); else { setState('err'); setMsg(j.error || 'Something went wrong. Please try again.'); }
  }
  if (state === 'done') return <div className="notice ok" style={{ marginTop: 22 }}>Thank you, you are registered for {title}. A confirmation has been sent to your email.</div>;
  return (
    <form className="regform card" style={{ padding: 26 }} onSubmit={submit}>
      <h3 className="h-md">Register</h3>
      <input name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
      <div className="row">
        <label>Title<select name="title" defaultValue="Mr">{ATTENDEE_TITLES.map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Full name<input name="name" required maxLength={100} placeholder="Enter your full name" /></label>
      </div>
      <div className="row">
        <label>Email<input name="email" type="email" required placeholder="you@example.com" /></label>
        <label>Phone<div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8 }}>
          <select name="code" defaultValue="+267">{COUNTRY_CODES.map(([c, n]) => <option key={c} value={c}>{c} {n}</option>)}</select>
          <input name="phone" type="tel" required placeholder="7XXXXXXX" /></div></label>
      </div>
      <div className="row">
        <label>Role<select name="role" defaultValue="Individual">{ATTENDEE_ROLES.map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Church / affiliation<input name="church" maxLength={120} placeholder="Enter your church or affiliation" /></label>
      </div>
      <div className="row">
        <label>Number attending<input name="attendees" type="number" min={1} max={50} defaultValue={1} required /></label>
        <label>Message (optional)<input name="message" maxLength={500} /></label>
      </div>
      {state === 'err' && <p className="notice err">{msg}</p>}
      <button className="btn btn-dark" disabled={state === 'busy'} style={{ justifySelf: 'start' }}>{state === 'busy' ? 'Registering…' : 'Register now'}</button>
    </form>
  );
}
