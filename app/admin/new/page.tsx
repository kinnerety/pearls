import { isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PlaceForm from '@/components/admin/PlaceForm';
import type { Place } from '@/lib/types';

const EMPTY_PLACE: Place = { id: 0, name: '', town: '', region: [], types: [], cats: [], link: '', descr: '', lat: null, lng: null, approx: true, shabbat: 'unknown', family: 'unknown', pick: false, tags: [], ctags: [] };

export default async function NewPlace() {
  if (!(await isAdmin())) redirect('/admin');
  return <PlaceForm initial={EMPTY_PLACE} hidden={false} />;
}
