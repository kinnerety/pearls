import Link from 'next/link';
import { CATS, CAT_SLUG, REGIONS, REGION_SLUG } from '@/lib/config';

// Bottom of the public pages: the small "אודות" link on the right (Kinneret, 2026-10-27; since 28.10 the home page has it in the top panel instead), and on the home page
// two quiet index lines to the region and category pages, so search engines find all 29 from the home page
export default function SiteFoot({ label, index = false }: { label?: string; index?: boolean }) {
  return (
    <footer className="site-foot">
      {index && (
        <div className="site-index">
          <p><b>לפי אזור:</b> {REGIONS.map((r, i) => <span key={r}>{i > 0 && ' · '}<Link href={`/region/${REGION_SLUG[r]}`}>{r}</Link></span>)}</p>
          <p><b>לפי קטגוריה:</b> {CATS.map((c, i) => <span key={c}>{i > 0 && ' · '}<Link href={`/category/${CAT_SLUG[c]}`}>{c}</Link></span>)}</p>
        </div>
      )}
      {label && <Link href="/about">{label}</Link>}
    </footer>
  );
}
