import type { Texts } from '@/lib/texts';

// The small menu under the filter panel (Kinneret, 30.10.2026): looks like a menu, not like filter chips.
// "אודות" lives here instead of beside the recommend button; the suggest and report links open the popup forms (Forms.tsx);
// "ליצור קשר" is shown but not active until its form exists.
export default function SideMenu({ texts }: { texts: Texts }) {
  return (
    <nav className="side-menu" aria-label="תפריט">
      <a href="/about">{texts['about.link']}</a>
      <a href="#suggest">להמליץ על פנינה</a>
      <a href="#report">לדווח על טעות</a>
      <span className="soon" title="בקרוב">ליצור קשר</span>
    </nav>
  );
}
