import type { MetadataRoute } from 'next';
import { listSermons } from '@/lib/sermons';
import { SITE } from '@/lib/site';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/about', '/sermons', '/events', '/conferences', '/leadership', '/house-church', '/contact', '/give'].map(p => ({ url: SITE.url + p }));
  const s = (await listSermons()).map(x => ({ url: `${SITE.url}/sermons/${x.slug}`, lastModified: x.preached_on }));
  return [...pages, ...s];
}
