import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { allPlaces, listSubmissions } from '@/lib/store';
import Inbox from '@/components/admin/Inbox';

// What visitors sent from the site's two forms: new pearl suggestions and mistake reports
export default async function InboxPage() {
  if (!(await isAdmin())) redirect('/admin');
  const [subs, places] = await Promise.all([listSubmissions(), allPlaces()]);
  return (
    <>
      <div className="adm-top">
        <h1>הצעות ודיווחים</h1>
        <div className="adm-row">
          <Link className="adm-btn ghost" href="/admin">→ לרשימה</Link>
          <Link className="adm-btn ghost" href="/admin/forms">טקסטים של הטפסים</Link>
        </div>
      </div>
      <p className="adm-hint">מה שנשלח מהטפסים באתר. המיילים מוצגים רק כאן, לצורך שאלות, ולא עולים לאתר.</p>
      <Inbox subs={subs.map(s => ({ ...s, created_at: String(s.created_at) }))} places={places.map(p => ({ id: p.id, name: p.name }))} />
    </>
  );
}
