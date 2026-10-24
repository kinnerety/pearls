import type { Metadata, Viewport } from 'next';
import { Frank_Ruhl_Libre, Assistant } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const display = Frank_Ruhl_Libre({ subsets: ['hebrew', 'latin'], weight: ['700', '900'], variable: '--font-display', display: 'swap' });
const body = Assistant({ subsets: ['hebrew', 'latin'], weight: ['400', '600', '700'], variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'פנינים ישראליות',
  description: 'מקומות קטנים ומיוחדים מהמלצות של חברים: טבע, אוכל, סדנאות ויוצרים בכל הארץ.',
  openGraph: { title: 'פנינים ישראליות', description: 'מקומות קטנים ומיוחדים מהמלצות של חברים', locale: 'he_IL', type: 'website' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#FAF7EF' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
