import type { Metadata } from 'next';
import { adminConfigured, isAdmin } from '@/lib/auth';
import { hasDb, listDrafts, listSubmissions } from '@/lib/store';
import AdminNav from '@/components/admin/AdminNav';
import './admin.css';

export const metadata: Metadata = { title: 'ניהול | פנינים ישראליות', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

// Three areas (Kinneret, 30.10.2026): new pearls, pearls on the site, fixed texts. The bar on top leads to each from anywhere.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = adminConfigured() && hasDb && await isAdmin();
  let counts = { drafts: 0, reports: 0 };
  if (signedIn) {
    const [drafts, subs] = await Promise.all([listDrafts('pending'), listSubmissions()]);
    counts = { drafts: drafts.length, reports: subs.filter(s => (s.kind === 'report' || s.kind === 'contact') && s.status === 'new').length };
  }
  return (
    <div className="wrap admin">
      {signedIn && <AdminNav counts={counts} />}
      {children}
    </div>
  );
}
