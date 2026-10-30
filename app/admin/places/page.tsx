import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { allPlaces, listSubmissions } from '@/lib/store';
import AdminList from '@/components/admin/AdminList';
import Reports from '@/components/admin/Reports';

// Area 2, the pearls already on the site: mistake reports from visitors on top, then the searchable list.
export default async function Places({ searchParams }: { searchParams: Promise<{ ok?: string; closed?: string; back?: string }> }) {
  if (!(await isAdmin())) redirect('/admin');
  const [places, subs, sp] = await Promise.all([allPlaces(), listSubmissions(), searchParams]);
  const reports = subs.filter(s => s.kind === 'report' && s.status === 'new').map(s => {
    const name = (s.data.place || '').trim();
    return { id: s.id, place: name, placeId: places.find(p => p.name.trim() === name)?.id ?? null, what: s.data.what || '', email: s.data.email || '', created_at: String(s.created_at) };
  });
  return (
    <div className="adm-area">
      {sp.ok && <p className="adm-toast">✓ "{sp.ok}" נשמרה</p>}
      {sp.closed && <p className="adm-toast">"{sp.closed}" הורדה מהאתר. אפשר להחזיר אותה מהלשונית "נסגרו".</p>}
      {sp.back && <p className="adm-toast">✓ "{sp.back}" חזרה לאתר</p>}
      <h1 className="adm-h1">פנינים באתר</h1>
      {reports.length > 0 && <Reports rows={reports} />}
      <AdminList places={places} />
    </div>
  );
}
