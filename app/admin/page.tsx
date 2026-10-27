import Link from 'next/link';
import { adminConfigured, isAdmin } from '@/lib/auth';
import { allPlaces, hasDb } from '@/lib/store';
import Login from '@/components/admin/Login';
import AdminList from '@/components/admin/AdminList';
import { logout } from './actions';

export default async function AdminHome() {
  if (!adminConfigured() || !hasDb) {
    return (
      <div className="adm-card">
        <h1>ניהול הפנינים</h1>
        <p>דף הניהול עוד לא מחובר. חסרים: {[!hasDb && 'מסד הנתונים (Neon)', !adminConfigured() && 'סיסמת ניהול (ADMIN_PASSWORD)'].filter(Boolean).join(' ו')}.</p>
        <p><Link href="/">→ לאתר</Link></p>
      </div>
    );
  }
  if (!(await isAdmin())) return <Login />;
  const places = await allPlaces();
  return (
    <>
      <div className="adm-top">
        <h1>ניהול הפנינים</h1>
        <div className="adm-row">
          <Link className="adm-btn" href="/admin/new">+ פנינה חדשה</Link>
          <Link className="adm-btn ghost" href="/admin/texts">טקסטים של האתר</Link>
          <Link className="adm-btn ghost" href="/admin/drafts">טיוטות מקישורים</Link>
          <Link className="adm-btn ghost" href="/" target="_blank">לאתר</Link>
          <form action={logout}><button className="adm-btn ghost">יציאה</button></form>
        </div>
      </div>
      <AdminList places={places} />
    </>
  );
}
