'use client';
import { useState } from 'react';
export default function ContactForm({ subject = '' }: { subject?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setState('sending');
    const f = new FormData(e.currentTarget);
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(f)) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { setState('ok'); (e.target as HTMLFormElement).reset(); } else { setState('err'); setErr(j.error || 'Something went wrong. Please call us instead.'); }
  }
  if (state === 'ok') return <p className="notice ok">Thank you. Your message has been sent and someone from the church will get back to you.</p>;
  return (
    <form className="form" onSubmit={submit}>
      <div className="grid g2" style={{ gap: 16 }}>
        <label>Name<input name="name" required maxLength={100} /></label>
        <label>Phone (optional)<input name="phone" maxLength={40} /></label>
      </div>
      <label>Email<input name="email" type="email" required maxLength={150} /></label>
      <label>Subject<select name="subject" defaultValue={subject || 'General enquiry'}>
        {['General enquiry', 'Plan a visit', 'House Church', 'Pastoral care', 'Prayer request', 'Volunteering', 'Event information', 'Other'].map(s => <option key={s}>{s}</option>)}</select></label>
      <label>Message<textarea name="message" required maxLength={2000} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: -9999 }} aria-hidden />
      {state === 'err' && <p className="notice err">{err}</p>}
      <button className="btn btn-dark" disabled={state === 'sending'} style={{ justifySelf: 'start' }}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
