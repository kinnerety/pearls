import Link from 'next/link';
import { CATS, CAT_SLUG, REGIONS, REGION_SLUG } from '@/lib/config';

// Bottom of the public pages. Place pages (and 404/contact) keep the small "אודות" link on the right (Kinneret, 2026-10-27).
// On the home page and the region/category pages (Kinneret, 30.10.2026) the footer sits inside the gallery column, aligned
// with the cards: the two quiet index lines to the 29 region and category pages (home only, so search engines find them all),
// and under them one row with every item of the side menu. "הצהרת נגישות" (the accessibility-statement thread, same day) is the fifth.
const MENU: { href: string; label: string }[] = [
  { href: '/about', label: 'אודות' },
  { href: '#suggest', label: 'להמליץ על פנינה' },
  { href: '#report', label: 'לדווח על טעות' },
  { href: '#contact', label: 'ליצור קשר' },
  { href: '/accessibility', label: 'הצהרת נגישות' },
];

export default function SiteFoot({ label, index = false, menu = false }: { label?: string; index?: boolean; menu?: boolean }) {
  return (
    <footer className="site-foot">
      {index && (
        <div className="site-index">
          <p><b>לפי אזור:</b> {REGIONS.map((r, i) => <span key={r}>{i > 0 && ' · '}<Link href={`/region/${REGION_SLUG[r]}`}>{r}</Link></span>)}</p>
          <p><b>לפי קטגוריה:</b> {CATS.map((c, i) => <span key={c}>{i > 0 && ' · '}<Link href={`/category/${CAT_SLUG[c]}`}>{c}</Link></span>)}</p>
        </div>
      )}
      {menu && (
        <p className="site-links">
          {MENU.map((m, i) => <span key={m.href}>{i > 0 && ' · '}{m.href.startsWith('#') ? <a href={m.href}>{m.label}</a> : <Link href={m.href}>{m.label}</Link>}</span>)}
        </p>
      )}
      {label && <Link href="/about">{label}</Link>}
    </footer>
  );
}
