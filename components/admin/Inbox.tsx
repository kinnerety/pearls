'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { markSubmission, removeSubmission } from '@/app/admin/actions';
import type { Submission } from '@/lib/store';

const ANSWER: Record<string, string> = { yes: 'כן', no: 'לא', unknown: 'לא יודעים' };
const when = (s: string) => new Date(s).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function Inbox({ subs, places }: { subs: Submission[]; places: { id: number; name: string }[] }) {
  const [rows, setRows] = useState(subs);
  const [show, setShow] = useState<'new' | 'suggest' | 'report' | 'done'>('new');
  const [busy, start] = useTransition();
  const list = rows.filter(r => show === 'new' ? r.status === 'new' : show === 'done' ? r.status === 'done' : r.kind === show);
  const tab = (k: typeof show, label: string, n: number) => <button type="button" className="chip" aria-pressed={show === k} onClick={() => setShow(k)}>{label} ({n})</button>;
  const mark = (id: number, status: Submission['status']) => start(async () => { await markSubmission(id, status); setRows(rs => rs.map(r => r.id === id ? { ...r, status } : r)); });
  const del = (id: number) => { if (confirm('למחוק לגמרי?')) start(async () => { await removeSubmission(id); setRows(rs => rs.filter(r => r.id !== id)); }); };

  return (
    <>
      <div className="adm-row">
        {tab('new', 'חדשים', rows.filter(r => r.status === 'new').length)}
        {tab('suggest', 'הצעות לפנינים', rows.filter(r => r.kind === 'suggest').length)}
        {tab('report', 'דיווחים על טעויות', rows.filter(r => r.kind === 'report').length)}
        {tab('done', 'טופלו', rows.filter(r => r.status === 'done').length)}
      </div>
      {!list.length && <p className="adm-hint">אין כאן כלום כרגע.</p>}
      <div className="adm-inbox">
        {list.map(r => {
          const d = r.data, place = d.place ? places.find(p => p.name.trim() === d.place.trim()) : undefined;
          return (
            <article key={r.id} className="adm-card adm-sub" data-done={r.status === 'done' || undefined}>
              <div className="adm-sub-head">
                <span className="adm-tag">{r.kind === 'suggest' ? 'הצעת פנינה' : 'דיווח על טעות'}</span>
                <span className="adm-hint">{when(r.created_at)}</span>
              </div>
              {r.kind === 'suggest' ? (
                <>
                  <h2>{d.name}</h2>
                  <dl>
                    <dt>מה זה</dt><dd>{d.what}</dd>
                    {d.link && <><dt>קישור</dt><dd>{/^https?:\/\//i.test(d.link) ? <a href={d.link} target="_blank" rel="noopener" dir="ltr">{d.link}</a> : <span dir="ltr">{d.link}</span>}</dd></>}
                    <dt>איפה</dt><dd>{d.where}</dd>
                    {d.love && <><dt>מה אהבו</dt><dd>{d.love}</dd></>}
                    {d.shabbat && <><dt>פתוח בשבת</dt><dd>{ANSWER[d.shabbat] || d.shabbat}</dd></>}
                    {d.family && <><dt>גם למשפחות</dt><dd>{ANSWER[d.family] || d.family}</dd></>}
                    {d.more && <><dt>עוד חשוב</dt><dd>{d.more}</dd></>}
                    <dt>לציין ממליץ</dt><dd>{d.credit === 'yes' ? `כן: "המלצה של ${d.credit_name}"` : 'לא'}</dd>
                    <dt>מייל לשאלות</dt><dd>{d.email ? <a href={`mailto:${d.email}`} dir="ltr">{d.email}</a> : 'לא'}</dd>
                  </dl>
                </>
              ) : (
                <>
                  <h2>{place ? <Link href={`/admin/p/${place.id}`}>{place.name}</Link> : d.place || 'כללי (לא פנינה מסוימת)'}</h2>
                  <dl>
                    <dt>מה לא נכון</dt><dd>{d.what}</dd>
                    <dt>מייל לשאלות</dt><dd>{d.email ? <a href={`mailto:${d.email}`} dir="ltr">{d.email}</a> : 'לא'}</dd>
                  </dl>
                </>
              )}
              <div className="adm-row">
                {r.status === 'new'
                  ? <button type="button" className="adm-btn" disabled={busy} onClick={() => mark(r.id, 'done')}>טופל ✓</button>
                  : <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => mark(r.id, 'new')}>החזרה לחדשים</button>}
                <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => del(r.id)}>מחיקה</button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
