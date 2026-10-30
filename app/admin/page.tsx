import Link from 'next/link';
import { adminConfigured, isAdmin } from '@/lib/auth';
import { allPlaces, hasDb, listDrafts, listSubmissions } from '@/lib/store';
import Login from '@/components/admin/Login';

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
  const [places, subs, drafts] = await Promise.all([allPlaces(), listSubmissions(), listDrafts('pending')]);
  const preparing = subs.filter(s => s.kind === 'suggest' && s.status === 'new').length;
  const reports = subs.filter(s => s.kind === 'report' && s.status === 'new').length;
  const live = places.filter(p => !p.hidden).length;
  return (
    <div className="adm-doors">
      <Link className="adm-door d1" href="/admin/drafts">
        <b>פנינים חדשות</b>
        <span>{drafts.length ? `${drafts.length} מחכות לעריכה ואישור` : 'אין פנינים שמחכות לך'}{preparing ? `, ${preparing} בהכנה` : ''}</span>
      </Link>
      <Link className="adm-door d2" href="/admin/places">
        <b>פנינים באתר</b>
        <span>{live} פנינים באתר{reports ? ` · ${reports === 1 ? 'דיווח אחד' : `${reports} דיווחים`} על טעות` : ''}</span>
      </Link>
      <Link className="adm-door d3" href="/admin/texts">
        <b>טקסטים קבועים</b>
        <span>הודעות באתר, אודות, דפי אזור וקטגוריה, טפסים</span>
      </Link>
    </div>
  );
}
