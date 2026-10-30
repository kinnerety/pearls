import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { allPlaces, listSubmissions } from '@/lib/store';
import PlaceForm from '@/components/admin/PlaceForm';

// Editing a pearl that is on the site. Opened from a mistake report (?report=<id>), the report shows above the fields.
export default async function EditPlace({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ report?: string }> }) {
  if (!(await isAdmin())) redirect('/admin');
  const id = +(await params).id;
  const rid = +((await searchParams).report || 0);
  const [places, subs] = await Promise.all([allPlaces(), rid ? listSubmissions() : Promise.resolve([])]);
  const p = places.find(x => x.id === id);
  if (!p) notFound();
  const r = subs.find(s => s.id === rid && s.kind === 'report');
  const { hidden, updated_at, ...place } = p;
  return <PlaceForm initial={place} hidden={!!hidden} updatedAt={updated_at} report={r ? { id: r.id, what: r.data.what || '', when: String(r.created_at) } : undefined} />;
}
