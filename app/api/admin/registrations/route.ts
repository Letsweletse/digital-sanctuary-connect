import { isAdmin } from '@/lib/auth';
import { listRegistrations, listPledges, hasImported, regReady } from '@/lib/registrations';
export const dynamic = 'force-dynamic';
const csvCell = (v: unknown) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export async function GET(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  if (!regReady()) return Response.json({ error: 'Registration storage is not connected.' }, { status: 503 });
  const u = new URL(req.url);
  const [regs, pledges, imported] = await Promise.all([listRegistrations(), listPledges(), hasImported()]);
  if (u.searchParams.get('format') === 'csv') {
    const kind = u.searchParams.get('kind') || 'registrations', ev = u.searchParams.get('event');
    let rows: string[][];
    if (kind === 'pledges') {
      rows = [['Pledged at', 'Event', 'Name', 'Email', 'Phone', 'Currency', 'Amount', 'Message'],
        ...pledges.map(p => [p.created_at, p.event, p.name, p.email, p.phone, p.currency, String(p.amount), p.message])];
    } else {
      const list = ev ? regs.filter(r => r.event === ev) : regs;
      rows = [['Registered at', 'Event', 'Event date', 'Title', 'Name', 'Email', 'Phone', 'Role', 'Church', 'Attendees', 'Message', 'Source'],
        ...list.map(r => [r.created_at, r.event, r.event_date, r.title, r.name, r.email, r.phone, r.role, r.church, String(r.attendees), r.message, r.source])];
    }
    const body = '﻿' + rows.map(r => r.map(csvCell).join(',')).join('\r\n');
    const name = `${kind}${ev ? '-' + ev.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''}-${new Date().toISOString().slice(0, 10)}.csv`;
    return new Response(body, { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="${name}"` } });
  }
  return Response.json({ registrations: regs, pledges, imported });
}
