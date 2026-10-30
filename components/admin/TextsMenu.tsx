'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// The side menu of the fixed-texts area: everything on the site that is not a pearl
const PAGES = [
  ['/admin/texts', 'הודעות וטקסטים באתר'],
  ['/admin/about', 'עמוד אודות'],
  ['/admin/intros', 'דפי אזור וקטגוריה'],
  ['/admin/forms', 'הטפסים'],
] as const;

export default function TextsMenu() {
  const path = usePathname();
  return (
    <nav className="adm-side" aria-label="טקסטים קבועים">
      {PAGES.map(([href, label]) => <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}>{label}</Link>)}
    </nav>
  );
}
