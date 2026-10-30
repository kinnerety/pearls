import type { Texts } from '@/lib/texts';
import { ACORN_BARE } from './art';

// Kinneret, 30.10.2026 10:14: Assistant like the filter chips (Suez One looked too heavy), every icon the same small size on the right
// The small menu under the filter panel (Kinneret, 30.10.2026): looks like a menu, not like filter chips.
// "אודות" lives here instead of beside the recommend button; the suggest and report links open the popup forms (Forms.tsx);
// "ליצור קשר" is shown but not active until its form exists (thread "בניית טופס יצירת קשר"). The phone is Kinneret's own picture, recoloured to the palette.
export default function SideMenu({ texts }: { texts: Texts }) {
  return (
    <nav className="side-menu" aria-label="תפריט">
      <a href="/about"><img className="ic" src="/art/menu-kinneret.png" alt="" />{texts['about.link']}</a>
      <a href="#suggest"><svg className="ic acorn" viewBox="10 3 44 61" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ACORN_BARE }} />להמליץ על פנינה</a>
      <a href="#report"><img className="ic juice" src="/art/menu-juice.png" alt="" />לדווח על טעות</a>
      <span className="soon" title="בקרוב"><img className="ic phone" src="/art/menu-phone.png" alt="" />ליצור קשר</span>
    </nav>
  );
}
