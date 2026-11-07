import { Resend } from 'resend';
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.website) return Response.json({ ok: true });
  const name = String(b.name || '').trim().slice(0, 100), email = String(b.email || '').trim().slice(0, 150);
  const phone = String(b.phone || '').trim().slice(0, 40), subject = String(b.subject || 'General enquiry').slice(0, 60);
  const message = String(b.message || '').trim().slice(0, 2000);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || message.length < 3) return Response.json({ error: 'Please fill in your name, a valid email and a message.' }, { status: 400 });
  if (!process.env.RESEND_API_KEY) return Response.json({ error: 'The contact form is not set up yet. Please call +267 350 0194.' }, { status: 503 });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM || 'Gate Gaborone Website <website@gategaborone.co.bw>',
    to: (process.env.CONTACT_TO || 'info@gategaborone.co.bw').split(',').map(s => s.trim()),
    replyTo: email,
    subject: `Website: ${subject} – ${name}`,
    html: `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Phone:</b> ${esc(phone || '-')}<br><b>Subject:</b> ${esc(subject)}</p><p style="white-space:pre-line">${esc(message)}</p>`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nSubject: ${subject}\n\n${message}`,
  });
  if (error) { console.error('contact', error); return Response.json({ error: 'We could not send your message. Please call +267 350 0194.' }, { status: 502 }); }
  return Response.json({ ok: true });
}
