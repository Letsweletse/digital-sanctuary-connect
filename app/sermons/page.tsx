import type { Metadata } from 'next';
import SermonList from '@/components/SermonList';
import PageHead from '@/components/PageHead';
import { listSermons } from '@/lib/sermons';
import { SITE } from '@/lib/site';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Sermons', description: 'Listen to and download Sunday messages from Gate Gaborone.' };

export default async function Sermons() {
  const sermons = await listSermons();
  return (
    <>
      <PageHead eyebrow="Sermon library" title={<>Sunday <em>messages</em>.</>} lede="Listen online, download for later, or share a message on WhatsApp. New messages are added every Sunday.">
        <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
          <a className="btn btn-sm" href={SITE.youtube} target="_blank" rel="noopener">Watch on YouTube</a>
          <a className="btn btn-sm" href="/podcast.xml">Podcast feed</a>
        </div>
      </PageHead>
      <section className="section tight">
        <div className="container"><SermonList sermons={sermons} siteUrl={SITE.url} /></div>
      </section>
    </>
  );
}
