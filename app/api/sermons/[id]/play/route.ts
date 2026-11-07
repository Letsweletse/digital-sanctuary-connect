import { bump } from '@/lib/sermons';
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await bump((await params).id, 'views').catch(() => {});
  return Response.json({ ok: true });
}
