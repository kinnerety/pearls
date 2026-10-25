import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { allPlaces } from '@/lib/store';
import PlaceForm from '@/components/admin/PlaceForm';

export default async function EditPlace({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect('/admin');
  const id = +(await params).id;
  const p = (await allPlaces()).find(x => x.id === id);
  if (!p) notFound();
  const { hidden, updated_at, ...place } = p;
  return <PlaceForm initial={place} hidden={!!hidden} updatedAt={updated_at} />;
}
