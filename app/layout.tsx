import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PlayerProvider } from '@/components/Player';
import { SITE } from '@/lib/site';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, type: 'website', images: ['/img/congregation.jpg'] },
  twitter: { card: 'summary_large_image' },
  alternates: { types: { 'application/rss+xml': [{ url: '/podcast.xml', title: 'Gate Gaborone Sermons' }] } },
};
export const viewport: Viewport = { themeColor: '#faf7f2', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <PlayerProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </PlayerProvider>
      </body>
    </html>
  );
}
