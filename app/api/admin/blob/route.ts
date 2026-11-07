import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { isAdmin } from '@/lib/auth';
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm'];
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body, request: req,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error('Not signed in');
        return { allowedContentTypes: TYPES, maximumSizeInBytes: 600 * 1048576, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(json);
  } catch (e) { return Response.json({ error: (e as Error).message }, { status: 400 }); }
}
