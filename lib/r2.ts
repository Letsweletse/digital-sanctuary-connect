import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export function r2Ready() {
  return !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET);
}
function client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
  });
}
export async function uploadUrl(key: string, contentType: string) {
  return getSignedUrl(client(), new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, ContentType: contentType }), { expiresIn: 3600 });
}
export async function downloadUrl(key: string, filename: string) {
  return getSignedUrl(client(), new GetObjectCommand({
    Bucket: process.env.R2_BUCKET!, Key: key,
    ResponseContentDisposition: `attachment; filename="${filename.replace(/"/g, '')}"`,
  }), { expiresIn: 600 });
}
export async function removeObject(key: string) {
  await client().send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
}
export function publicUrl(key: string) {
  return `${(process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')}/${key}`;
}
