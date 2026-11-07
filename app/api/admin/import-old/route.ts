// One-time copy of registrations and pledges from the old (Lovable) website database.
import { isAdmin } from '@/lib/auth';
import { saveImported, regReady, type Registration, type Pledge } from '@/lib/registrations';
export const maxDuration = 60;
export async function POST() {
  if (!(await isAdmin())) return Response.json({ error: 'Not signed in' }, { status: 401 });
  if (!regReady()) return Response.json({ error: 'Registration storage is not connected.' }, { status: 503 });
  const base = process.env.SUPABASE_URL, key = process.env.OLD_SUPABASE_ANON_KEY;
  if (!base || !key) return Response.json({ error: 'Old database address is not configured.' }, { status: 503 });
  const get = async (t: string) => {
    const r = await fetch(`${base}/rest/v1/${t}?select=*`, { headers: { apikey: key, Authorization: `Bearer ${key}`, Range: '0-9999' }, cache: 'no-store' });
    if (!r.ok) throw new Error(`${t}: ${r.status}`);
    return r.json() as Promise<Record<string, any>[]>;
  };
  try {
    const [regs, pls] = await Promise.all([get('event_registrations'), get('pledges')]);
    const registrations: Registration[] = regs.map(r => ({
      id: String(r.id), event: r.event_name || '', event_slug: '', event_date: r.event_date || '', created_at: r.created_at,
      title: r.attendee_title || '', name: r.attendee_name || '', email: r.attendee_email || '', phone: r.attendee_phone || '',
      role: r.attendee_role || '', church: r.attendee_denomination || '', attendees: Number(r.number_of_attendees) || 1,
      message: r.additional_message || '', source: 'old-site',
    }));
    const pledges: Pledge[] = pls.map(p => ({
      id: String(p.id), event: p.event_name || '', created_at: p.created_at, name: p.pledger_name || '', email: p.pledger_email || '',
      phone: p.pledger_phone || '', currency: p.currency || '', amount: Number(p.pledge_amount) || 0, message: p.message || '', source: 'old-site',
    }));
    await saveImported({ registrations, pledges, imported_at: new Date().toISOString() });
    return Response.json({ ok: true, registrations: registrations.length, pledges: pledges.length });
  } catch (e) { return Response.json({ error: (e as Error).message }, { status: 502 }); }
}
