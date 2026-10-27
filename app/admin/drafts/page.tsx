import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { listDrafts as fileDrafts } from '@/lib/drafts';
import { addDraft, draftExists, getTexts, listDrafts, listSubmissions } from '@/lib/store';
import DraftReview from '@/components/admin/DraftReview';

// One page for every new pearl waiting for Kinneret: the real card + map, and approve / reject / edit per pearl.
// Drafts come from the daily run over visitors' suggestions (API) or from a link Claude was given (data/drafts/*.json,
// pulled into the table here so both kinds are handled the same way).
export default async function Drafts() {
  if (!(await isAdmin())) redirect('/admin');
  for (const d of fileDrafts()) if (!(await draftExists(d.place.name))) await addDraft(d.place, null);
  const [pending, subs, texts] = await Promise.all([listDrafts('pending'), listSubmissions(), getTexts()]);
  const bySub = new Map(subs.map(s => [s.id, s.data]));
  const rows = pending.map(d => {
    const s = d.submission_id ? bySub.get(d.submission_id) : undefined;
    // the suggester's own words, for context (the email stays in the inbox only)
    return { id: d.id, place: d.data, created_at: String(d.created_at), from: s ? { name: s.name, what: s.what, where: s.where, love: s.love, more: s.more, credit: s.credit === 'yes' ? s.credit_name : '' } : null };
  });
  return (
    <>
      <div className="adm-top">
        <h1>פנינים חדשות לאישור</h1>
        <div className="adm-row">
          <Link className="adm-btn ghost" href="/admin">→ לרשימה</Link>
          <Link className="adm-btn ghost" href="/admin/inbox">הצעות ודיווחים</Link>
        </div>
      </div>
      <p className="adm-hint">כל פנינה כאן נראית בדיוק כמו שתיראה באתר. "אישור" מכניס אותה לאתר כמו שהיא (בלי "נבדק ידנית"), "עריכה" פותחת אותה לתיקון לפני האישור, "דחייה" מורידה אותה מהרשימה.</p>
      <DraftReview rows={rows} texts={texts} />
    </>
  );
}
