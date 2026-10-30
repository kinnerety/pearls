'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/admin/actions';

export const TEXT_PAGES = ['/admin/texts', '/admin/about', '/admin/intros', '/admin/forms'];

/** Which of the three areas a path belongs to */
function area(path: string) {
  if (path.startsWith('/admin/drafts') || path === '/admin/new') return 'new';
  if (path.startsWith('/admin/places') || path.startsWith('/admin/p/')) return 'live';
  if (TEXT_PAGES.some(t => path.startsWith(t))) return 'texts';
  return 'home';
}

export default function AdminNav({ counts }: { counts: { drafts: number; reports: number } }) {
  const now = area(usePathname());
  const tab = (key: string, href: string, label: string, n = 0) => (
    <Link href={href} className="adm-nav-tab" aria-current={now === key ? 'page' : undefined}>
      {label}{n > 0 && <span className="adm-count">{n}</span>}
    </Link>
  );
  return (
    <nav className="adm-nav" aria-label="אזורי הניהול">
      <Link href="/admin" className="adm-nav-logo">ניהול הפנינים</Link>
      {tab('new', '/admin/drafts', 'פנינים חדשות', counts.drafts)}
      {tab('live', '/admin/places', 'פנינים באתר', counts.reports)}
      {tab('texts', '/admin/texts', 'טקסטים קבועים')}
      <span className="adm-nav-sp" />
      <Link href="/" target="_blank" className="adm-nav-quiet">לאתר</Link>
      <form action={logout}><button className="adm-nav-quiet">יציאה</button></form>
    </nav>
  );
}
