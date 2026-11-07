import { checkKey, setAdmin, clearAdmin } from '@/lib/auth';
export async function POST(req: Request) {
  const { key } = await req.json().catch(() => ({ key: '' }));
  await new Promise(r => setTimeout(r, 400));
  if (!checkKey(String(key || ''))) return Response.json({ error: 'Wrong password' }, { status: 401 });
  await setAdmin(); return Response.json({ ok: true });
}
export async function DELETE() { await clearAdmin(); return Response.json({ ok: true }); }
