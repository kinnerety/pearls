import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { listDrafts } from '@/lib/drafts';
import { allPlaces } from '@/lib/store';
import DraftList from '@/components/admin/DraftList';

export default async function Drafts() {
  if (!(await isAdmin())) redirect('/admin');
  const [drafts, places] = await Promise.all([listDrafts(), allPlaces()]);
  const names = new Set(places.map(p => p.name.trim()));
  const rows = drafts.map(d => ({ key: d.key, name: d.place.name, town: d.place.town, cats: d.place.cats, exists: names.has(d.place.name.trim()) }));
  return (
    <>
      <div className="adm-top">
        <h1>טיוטות מקישורים</h1>
        <div className="adm-row"><Link className="adm-btn ghost" href="/admin">→ לרשימה</Link></div>
      </div>
      <p className="adm-hint">פנינים שנאספו מקישור ועוד לא נכנסו לאתר. "הוספה לאתר" מכניסה את הפנינה למאגר (לא מסומנת "נבדק ידנית"); אחר כך אפשר לערוך אותה כרגיל.</p>
      <DraftList rows={rows} />
    </>
  );
}
