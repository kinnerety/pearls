import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { listDrafts as fileDrafts } from '@/lib/drafts';
import { addDraft, draftExists, listDrafts, listSubmissions } from '@/lib/store';
import Preparing from '@/components/admin/Preparing';

const when = (s: string) => new Date(s).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric' });

// Area 1, new pearls: the ones waiting for Kinneret (each opens on one screen to edit and approve), and the visitors'
// suggestions the morning run hasn't prepared yet. Drafts from a link Claude was given (data/drafts/*.json) are pulled in here.
export default async function Drafts({ searchParams }: { searchParams: Promise<{ ok?: string; no?: string }> }) {
  if (!(await isAdmin())) redirect('/admin');
  for (const d of fileDrafts()) if (!(await draftExists(d.place.name))) await addDraft(d.place, null);
  const [pending, subs, sp] = await Promise.all([listDrafts('pending'), listSubmissions(), searchParams]);
  const preparing = subs.filter(s => s.kind === 'suggest' && s.status === 'new')
    .map(s => ({ id: s.id, name: s.data.name || '', where: s.data.where || '', what: s.data.what || '', created_at: String(s.created_at) }));
  return (
    <div className="adm-area">
      {sp.ok && <p className="adm-toast">✓ "{sp.ok}" עלתה לאתר. {pending.length ? '' : 'זהו, עברת על כולן.'}</p>}
      {sp.no && <p className="adm-toast">"{sp.no}" הורדה מהרשימה.</p>}
      <div className="adm-top">
        <h1>מחכות לך ({pending.length})</h1>
        <Link className="adm-btn ghost" href="/admin/new">+ פנינה חדשה בלי הצעה</Link>
      </div>
      {pending.length ? (
        <div className="adm-queue">
          {pending.map(d => (
            <Link key={d.id} className="adm-qitem" href={`/admin/drafts/${d.id}`}>
              <span><b>{d.data.name}</b><small>{[d.data.town, d.submission_id ? 'הצעה באתר' : 'מקישור', when(String(d.created_at))].filter(Boolean).join(' · ')}</small></span>
              <span className="adm-tag suggest">לעריכה ואישור ←</span>
            </Link>
          ))}
        </div>
      ) : <p className="adm-hint">אין פנינים שמחכות לך כרגע.</p>}
      <p className="adm-hint">יש לך קישור לפנינה? שלחי לי אותו בצ׳אט, והיא תופיע כאן מוכנה לעריכה.</p>
      {preparing.length > 0 && (
        <>
          <h2 className="adm-h2">בהכנה ({preparing.length})</h2>
          <p className="adm-hint">הצעות שהגיעו מהטופס באתר. כל בוקר אני כותב להן תקציר וממלא את הפרטים, ואז הן עוברות ל"מחכות לך".</p>
          <Preparing rows={preparing} />
        </>
      )}
    </div>
  );
}
