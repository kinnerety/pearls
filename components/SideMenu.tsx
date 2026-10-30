import { Suez_One } from 'next/font/google';
import type { Texts } from '@/lib/texts';
import { ACORN_BARE } from './art';

// Kinneret, 30.10.2026: the menu in Suez One, not bold, with a small icon on the right of each item
const menuFont = Suez_One({ subsets: ['hebrew', 'latin'], weight: '400', display: 'swap' });

// an old-style telephone handset, ink, for "ליצור קשר"
// an old cream rotary telephone (Kinneret, 30.10.2026): body in cream, dial and handset in ink
const PHONE = `<path d="M10 52c0-14 8-26 22-26s22 12 22 26z" fill="#F2E8CC" stroke="#22333B" stroke-width="2.5" stroke-linejoin="round"/><rect x="6" y="50" width="52" height="7" rx="3" fill="#F2E8CC" stroke="#22333B" stroke-width="2.5"/><circle cx="32" cy="40" r="9" fill="#FFFFFF" stroke="#22333B" stroke-width="2.2"/><circle cx="32" cy="33.5" r="1.6" fill="#22333B"/><circle cx="37.5" cy="36" r="1.6" fill="#22333B"/><circle cx="38" cy="42" r="1.6" fill="#22333B"/><circle cx="26.5" cy="36" r="1.6" fill="#22333B"/><circle cx="26" cy="42" r="1.6" fill="#22333B"/><circle cx="32" cy="46" r="1.6" fill="#22333B"/><path d="M10 24c0-5 4-7 7-7 3 0 5 2 5 5v4H10zM42 24c0-5 4-7 7-7 3 0 5 2 5 5v4H42z" fill="#22333B"/><path d="M16 22c4-8 28-8 32 0" fill="none" stroke="#22333B" stroke-width="5" stroke-linecap="round"/></svg>`.replace('</svg>', '');

// The small menu under the filter panel (Kinneret, 30.10.2026): looks like a menu, not like filter chips.
// "אודות" lives here instead of beside the recommend button; the suggest and report links open the popup forms (Forms.tsx);
// "ליצור קשר" opens the contact form (#contact, Forms.tsx).
export default function SideMenu({ texts }: { texts: Texts }) {
  return (
    <nav className={'side-menu ' + menuFont.className} aria-label="תפריט">
      <a href="/about"><img className="ic" src="/art/menu-kinneret.png" alt="" />{texts['about.link']}</a>
      <a href="#suggest"><svg className="ic acorn" viewBox="10 3 44 61" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ACORN_BARE }} />להמליץ על פנינה</a>
      <a href="#report"><img className="ic juice" src="/art/menu-juice.png" alt="" />לדווח על טעות</a>
      <a href="#contact"><svg className="ic" viewBox="0 0 64 64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: PHONE }} />ליצור קשר</a>
    </nav>
  );
}
