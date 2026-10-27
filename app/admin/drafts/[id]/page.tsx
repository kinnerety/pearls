import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getDraftRow } from '@/lib/store';
import PlaceForm from '@/components/admin/PlaceForm';

// Edit a draft before approving it: the regular place form, whose "save" approves the draft
export default async function EditDraft({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect('/admin');
  const id = +(await params).id;
  const d = await getDraftRow(id);
  if (!d || d.status !== 'pending') notFound();
  return <PlaceForm initial={{ ...d.data, id: 0 }} hidden={false} draftId={id} />;
}
