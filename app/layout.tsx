import type { Metadata, Viewport } from 'next';
import { Suez_One, Assistant } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SITE_DESCRIPTION, SITE_URL } from '@/lib/slug';
import './globals.css';

const display = Suez_One({ subsets: ['hebrew', 'latin'], weight: '400', variable: '--font-display', display: 'swap' });
const body = Assistant({ subsets: ['hebrew', 'latin'], weight: ['400', '600', '700'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'פנינים ישראליות',
  // the sentence search results show under the title (Kinneret's wording, 2026-10-27): says in plain words what people search for (trips, places in Israel)
  description: SITE_DESCRIPTION,
  // proves to Google Search Console (account kinneret@drafttt.co.il) that the site is Kinneret's
  verification: { google: 'AGdNMcuWajpwXubzXC3KvokLG5WinRlZrdmh_f1Jrcc' },
  openGraph: { title: 'פנינים ישראליות', description: 'מקומות קטנים ומיוחדים מהמלצות של חברים', locale: 'he_IL', type: 'website' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#FAF7EF' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* keyboard and screen-reader users jump over the header and the filters' top strip straight to the page's content */}
        <a className="skip" href="#content">דילוג לתוכן</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
