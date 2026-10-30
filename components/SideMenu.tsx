import type { Texts } from '@/lib/texts';
import { ACORN_BARE } from './art';

// Kinneret, 30.10.2026 10:14: Assistant like the filter chips (Suez One looked too heavy), every icon the same small size on the right
// The small menu under the filter panel (Kinneret, 30.10.2026): looks like a menu, not like filter chips.
// "אודות" lives here instead of beside the recommend button; the suggest and report links open the popup forms (Forms.tsx);
// "ליצור קשר" opens the contact popup (#contact, Forms.tsx). The phone is Kinneret's own picture, recoloured to the palette.
export default function SideMenu({ texts }: { texts: Texts }) {
  return (
    <nav className="side-menu" aria-label="תפריט">
      <a href="/about"><img className="ic" src="/art/menu-kinneret.png" alt="" />{texts['about.link']}</a>
      <a href="#suggest"><svg className="ic acorn" viewBox="10 3 44 61" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ACORN_BARE }} />להמליץ על פנינה</a>
      <a href="#report"><img className="ic juice" src="/art/menu-juice.png" alt="" />לדווח על טעות</a>
      <a href="#contact"><img className="ic phone" src="/art/menu-phone.png" alt="" />ליצור קשר</a>
      {/* the accessibility statement (Kinneret chose the menu, 30.10.2026): the universal access figure in teal on a light-blue circle */}
      <a href="/accessibility"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--mist)" /><circle cx="12" cy="6.3" r="1.8" fill="var(--teal)" /><path d="M6.5 9.2l5.5 1 5.5-1M12 10.2v4.3l-2.6 4.6M12 14.5l2.6 4.6" stroke="var(--teal)" strokeWidth="1.7" fill="none" strokeLinecap="round" /></svg>הצהרת נגישות</a>
    </nav>
  );
}
