import { Suez_One } from 'next/font/google';
import type { Texts } from '@/lib/texts';
import { ACORN_BARE } from './art';

// Kinneret, 30.10.2026: the menu in Suez One, not bold, with a small icon on the right of each item
const menuFont = Suez_One({ subsets: ['hebrew', 'latin'], weight: '400', display: 'swap' });

// an old-style telephone handset, ink, for "ליצור קשר"

// The small menu under the filter panel (Kinneret, 30.10.2026): looks like a menu, not like filter chips.
// "אודות" lives here instead of beside the recommend button; the suggest and report links open the popup forms (Forms.tsx);
// "ליצור קשר" opens the contact form (#contact, Forms.tsx).
export default function SideMenu({ texts }: { texts: Texts }) {
  return (
    <nav className={'side-menu ' + menuFont.className} aria-label="תפריט">
      <a href="/about"><img className="ic" src="/art/menu-kinneret.png" alt="" />{texts['about.link']}</a>
      <a href="#suggest"><svg className="ic acorn" viewBox="10 3 44 61" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ACORN_BARE }} />להמליץ על פנינה</a>
      <a href="#report"><img className="ic juice" src="/art/menu-juice.png" alt="" />לדווח על טעות</a>
      <a href="#contact"><img className="ic phone" src="/art/menu-phone.png" alt="" />ליצור קשר</a>
    </nav>
  );
}
