import { Suez_One } from 'next/font/google';
import type { Texts } from '@/lib/texts';
import { ACORN_BARE } from './art';

// Kinneret, 30.10.2026: the menu in Suez One, not bold, with a small icon on the right of each item
const menuFont = Suez_One({ subsets: ['hebrew', 'latin'], weight: '400', display: 'swap' });

// an old-style telephone handset, ink, for "ליצור קשר"
const PHONE = `<path d="M14 42c10 12 26 20 36 20 4 0 8-3 8-7l-2-7c-1-3-4-4-7-3l-7 3c-7-4-13-10-17-17l3-7c1-3 0-6-3-7l-7-2c-4 0-7 4-7 8 0 6 2 13 3 19z" fill="#22333B"/>`;

// The small menu under the filter panel (Kinneret, 30.10.2026): looks like a menu, not like filter chips.
// "אודות" lives here instead of beside the recommend button; the suggest and report links open the popup forms (Forms.tsx);
// "ליצור קשר" is shown but not active until its form exists (thread "בניית טופס יצירת קשר").
export default function SideMenu({ texts }: { texts: Texts }) {
  return (
    <nav className={'side-menu ' + menuFont.className} aria-label="תפריט">
      <a href="/about"><img className="ic" src="/art/menu-kinneret.png" alt="" />{texts['about.link']}</a>
      <a href="#suggest"><svg className="ic acorn" viewBox="10 3 44 61" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ACORN_BARE }} />להמליץ על פנינה</a>
      <a href="#report"><img className="ic shell" src="/art/shell.png" alt="" />לדווח על טעות</a>
      <span className="soon" title="בקרוב"><svg className="ic" viewBox="0 0 64 64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PHONE }} />ליצור קשר</span>
    </nav>
  );
}
