import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getDraftRow, getTexts, listDrafts, listSubmissions } from '@/lib/store';
import PlaceForm from '@/components/admin/PlaceForm';

// One new pearl on one screen: the fields and the card as it will look, next to where it came from and the sources
// Claude read. Approving (or "לא מתאים") moves straight on to the next pearl in line.
export default async function ReviewDraft({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; no?: string }> }) {
  if (!(await isAdmin())) redirect('/admin');
  const id = +(await params).id;
  const sp = await searchParams;
  const notice = sp.ok ? `✓ "${sp.ok}" עלתה לאתר` : sp.no ? `"${sp.no}" הורדה מהרשימה` : undefined;
  const [d, pending, subs, texts] = await Promise.all([getDraftRow(id), listDrafts('pending'), listSubmissions(), getTexts()]);
  if (!d || d.status !== 'pending') notFound();
  const at = pending.findIndex(x => x.id === id);
  const next = pending[at + 1] ?? pending.find(x => x.id !== id);
  const s = d.submission_id ? subs.find(x => x.id === d.submission_id)?.data : undefined;
  const { sources = [], ...place } = d.data as typeof d.data & { sources?: { title?: string; url: string }[] };
  const from = s ? {
    kind: 'הצעה באתר', when: String(d.created_at), name: s.name, what: s.what, where: s.where, link: s.link, love: s.love, more: s.more,
    shabbat: s.shabbat, family: s.family, credit: s.credit === 'yes' ? s.credit_name : '', email: s.email,
  } : { kind: 'מקישור', when: String(d.created_at) };
  return (
    <PlaceForm initial={{ ...place, id: 0 }} hidden={false} draft={{ id, from, sources, pos: at + 1, total: pending.length, next: next?.id ?? null }} texts={texts} notice={notice} />
  );
}
