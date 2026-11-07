import { Resend } from 'resend';
import { EVENTS, SITE, ATTENDEE_TITLES, ATTENDEE_ROLES } from '@/lib/site';
import { addRegistration, regReady } from '@/lib/registrations';
import { fmtEventDate } from '@/lib/events';
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return Response.json({ ok: true });
  const ev = EVENTS.find(e => e.slug === b.event && e.registration);
  if (!ev) return Response.json({ error: 'Registration for this event is closed.' }, { status: 400 });
  const s = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);
  const name = s(b.name, 100), email = s(b.email, 150).toLowerCase(), phone = `${s(b.code, 5)} ${s(b.phone, 20)}`.trim();
  const title = ATTENDEE_TITLES.includes(b.title) ? b.title : '', role = ATTENDEE_ROLES.includes(b.role) ? b.role : 'Individual';
  const attendees = Math.min(Math.max(parseInt(b.attendees) || 1, 1), 50);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || s(b.phone, 20).length < 7) return Response.json({ error: 'Please enter your full name, a valid email and phone number.' }, { status: 400 });
  if (!regReady()) return Response.json({ error: `Registration is not available right now. Please contact ${ev.contact || SITE.email}.` }, { status: 503 });
  const r = { id: crypto.randomUUID(), event: ev.title, event_slug: ev.slug, event_date: ev.date, created_at: new Date().toISOString(),
    title, name, email, phone, role, church: s(b.church, 120), attendees, message: s(b.message, 1000), source: 'website' as const };
  await addRegistration(r);
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.CONTACT_FROM || 'Gate Gaborone <website@gategaborone.co.bw>';
    const when = `${fmtEventDate(ev.date)}${ev.time ? ` · ${ev.time}` : ''}`;
    await Promise.allSettled([
      resend.emails.send({ from, to: [email], replyTo: (process.env.CONTACT_TO || SITE.email).split(',')[0],
        subject: `You're registered: ${ev.title}`,
        html: `<p>Dear ${esc(title ? `${title} ${name}` : name)},</p><p>Thank you for registering for <b>${esc(ev.title)}</b>.</p><p><b>When:</b> ${esc(when)}<br><b>Where:</b> ${esc(ev.venue)}<br><b>Attending:</b> ${attendees}</p>${ev.fee ? `<p><b>Fee:</b> ${esc(ev.fee)}</p>` : ''}<p>We look forward to seeing you.<br>Gate Gaborone</p>`,
        text: `Thank you for registering for ${ev.title}.\nWhen: ${when}\nWhere: ${ev.venue}\nAttending: ${attendees}\n\nGate Gaborone` }),
      resend.emails.send({ from, to: (process.env.CONTACT_TO || SITE.email).split(',').map(x => x.trim()), replyTo: email,
        subject: `New registration: ${ev.title} – ${name} (${attendees})`,
        text: `Event: ${ev.title}\nName: ${title} ${name}\nEmail: ${email}\nPhone: ${phone}\nRole: ${role}\nChurch: ${r.church || '-'}\nAttendees: ${attendees}\nMessage: ${r.message || '-'}` }),
    ]);
  }
  return Response.json({ ok: true });
}
