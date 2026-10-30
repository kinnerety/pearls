import Link from 'next/link';
import { CATS, CAT_SLUG, REGION_SLUG, ZONES } from '@/lib/config';
import { FAVICON_ACORN } from './art';

// The site footer (Kinneret, 30.10.2026 12:17, option ג chosen 12:51: the dark teal paper with light text): a full band at the bottom of every public page with links to all 18 region pages
// (grouped by cloud, dot in the cloud's colour), all 11 category pages, and the same five links as the side menu
// (the side-menu panel itself stays where it is). The logo block is her logo: the acorn with "פנינים" over "ישראליות".
const MENU: { href: string; label: string }[] = [
  { href: '/about', label: 'אודות' },
  { href: '#suggest', label: 'להמליץ על פנינה' },
  { href: '#report', label: 'לדווח על טעות' },
  { href: '/contact', label: 'ליצור קשר' },
  { href: '/accessibility', label: 'הצהרת נגישות' },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="תחתית האתר">
      <svg className="edge" viewBox="0 0 1200 72" preserveAspectRatio="none" aria-hidden="true">
        {/* soft rolling hills like the header's, not symmetric (Kinneret 13:00): a lighter hill behind, the footer's paper in front */}
        <path className="back" d="M0 72V34C110 18 210 12 330 24C430 34 480 50 570 44C690 36 740 12 860 10C980 8 1080 18 1200 30V72Z" />
        <path d="M0 72V56C90 50 170 58 260 52C370 44 420 30 520 34C640 40 700 58 800 54C900 50 960 28 1060 30C1130 32 1170 42 1200 46V72Z" />
      </svg>
      <div className="inner">
        <div className="brand">
          <svg className="acorn" viewBox="0 0 64 64" aria-hidden="true" dangerouslySetInnerHTML={{ __html: FAVICON_ACORN }} />
          <span className="name"><span>פנינים</span><span>ישראליות</span></span>
          <span className="tag">מקומות קטנים ומיוחדים מהמלצות של חברים</span>
        </div>
        <nav className="col regions" aria-label="פנינים לפי אזור">
          <h2>לפי אזור</h2>
          <div className="zones">
            {Object.entries(ZONES).map(([z, rs], i) => (
              <div className={'zone z' + i} key={z}>
                <b><i className="dot" />{z}</b>
                {rs.map(r => <Link key={r} href={`/region/${REGION_SLUG[r]}`}>{r}</Link>)}
              </div>
            ))}
          </div>
        </nav>
        <nav className="col cats" aria-label="פנינים לפי קטגוריה">
          <h2>לפי קטגוריה</h2>
          <div className="links">{CATS.map(c => <Link key={c} href={`/category/${CAT_SLUG[c]}`}>{c}</Link>)}</div>
        </nav>
        <nav className="col more" aria-label="עוד באתר">
          <h2>עוד באתר</h2>
          <div className="links">{MENU.map(m => m.href.startsWith('#') ? <a key={m.href} href={m.href}>{m.label}</a> : <Link key={m.href} href={m.href}>{m.label}</Link>)}</div>
        </nav>
      </div>
    </footer>
  );
}
