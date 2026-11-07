import type { Metadata } from 'next';
import { isAdmin } from '@/lib/auth';
import { listSermons } from '@/lib/sermons';
import { db } from '@/lib/db';
import { r2Ready } from '@/lib/r2';
import { Login, Panel } from '@/components/Admin';
import { LEADERS } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Media team', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const ok = await isAdmin();
  const sermons = ok ? await listSermons({ includeHidden: true }) : [];
  const speakers = [...new Set([...LEADERS.map(l => l.name.startsWith('Pastor') ? l.name : l.name), ...sermons.map(s => s.speaker), 'Peter Taylor'])];
  return (
    <section className="section" style={{ paddingTop: 140, minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 980 }}>
        <p className="eyebrow" style={{ color: 'var(--gold-d)' }}>Media team</p>
        <h1 className="h-lg" style={{ margin: '10px 0 34px' }}>Sermon uploads</h1>
        {ok ? <Panel initial={sermons} speakers={speakers} ready={{ db: !!db(), r2: r2Ready() }} /> : <Login />}
      </div>
    </section>
  );
}
