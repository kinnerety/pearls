'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import type { Place } from '@/lib/types';
import type { Texts } from '@/lib/texts';
import { acceptDraft, declineDraft } from '@/app/admin/actions';
import PlaceCard from '@/components/PlaceCard';
import PlaceMap from '@/components/PlaceMap';
import { TextsProvider } from '@/components/TextsContext';

type From = { name?: string; what?: string; where?: string; love?: string; more?: string; credit?: string };
type Row = { id: number; place: Place; created_at: string; from: From | null };
const when = (s: string) => new Date(s).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' });

export default function DraftReview({ rows, texts }: { rows: Row[]; texts: Texts }) {
  const [done, setDone] = useState<Record<number, { kind: 'ok' | 'no'; id?: number } | { kind: 'err'; msg: string }>>({});
  const [busy, start] = useTransition();
  const open = rows.filter(r => !done[r.id] || done[r.id].kind === 'err');
  if (!rows.length) return <p className="adm-hint">אין פנינים חדשות לאישור כרגע.</p>;
  return (
    <TextsProvider texts={texts}>
      <div className="adm-drafts">
        {rows.map(r => {
          const d = done[r.id], p = r.place;
          if (d && d.kind === 'ok') return <div key={r.id} className="adm-card adm-draft-done">✓ "{p.name}" באתר. <Link href={`/admin/p/${d.id}`}>לעריכה</Link></div>;
          if (d && d.kind === 'no') return <div key={r.id} className="adm-card adm-draft-done">נדחתה: "{p.name}"</div>;
          return (
            <section key={r.id} className="adm-card adm-draft">
              <div className="adm-sub-head">
                <span className="adm-tag">{r.from ? 'מהצעה באתר' : 'מקישור'}</span>
                <span className="adm-hint">{when(r.created_at)}</span>
              </div>
              <div className="adm-draft-body">
                <div className="list draft-list"><PlaceCard p={p} /></div>
                <div className="adm-draft-side">
                  {p.lat != null && <div className="mapbox place-map adm-draft-map"><PlaceMap p={p} /></div>}
                  <dl className="adm-draft-meta">
                    <dt>שבת</dt><dd>{{ open: 'פתוח בשבת', closed: 'סגור בשבת', unknown: 'לא ידוע' }[p.shabbat]}</dd>
                    <dt>משפחות</dt><dd>{{ yes: 'גם למשפחות', no: 'לא', unknown: 'לא ידוע' }[p.family]}</dd>
                    <dt>מיקום</dt><dd>{p.lat != null && p.precision === 'exact' ? 'מדויק' : <strong>לא מצאתי מיקום מדויק{p.lat != null ? ' (כרגע במרכז היישוב)' : ''}</strong>}{p.geo_source ? ` · ${p.geo_source}` : ''}</dd>
                    {p.hours && <><dt>שעות ומידע</dt><dd>{p.hours}</dd></>}
                    {p.tags.length > 0 && <><dt>תגיות</dt><dd>{p.tags.join(', ')}</dd></>}
                  </dl>
                  {r.from && (
                    <details className="adm-draft-from">
                      <summary>מה כתבו בהצעה</summary>
                      <dl className="adm-draft-meta">
                        <dt>שם</dt><dd>{r.from.name}</dd>
                        <dt>מה זה</dt><dd>{r.from.what}</dd>
                        <dt>איפה</dt><dd>{r.from.where}</dd>
                        {r.from.love && <><dt>מה אהבו</dt><dd>{r.from.love}</dd></>}
                        {r.from.more && <><dt>עוד חשוב</dt><dd>{r.from.more}</dd></>}
                        {r.from.credit && <><dt>ממליץ/ה</dt><dd>{r.from.credit}</dd></>}
                      </dl>
                    </details>
                  )}
                </div>
              </div>
              {d && d.kind === 'err' && <p className="adm-err">{d.msg}</p>}
              <div className="adm-row">
                <button type="button" className="adm-btn" disabled={busy} onClick={() => start(async () => {
                  const res = await acceptDraft(r.id, p);
                  setDone(x => ({ ...x, [r.id]: res.ok ? { kind: 'ok', id: res.id } : { kind: 'err', msg: res.errors.join(', ') } }));
                })}>אישור, לאתר</button>
                <Link className="adm-btn ghost" href={`/admin/drafts/${r.id}`}>עריכה לפני האישור</Link>
                <button type="button" className="adm-btn danger" disabled={busy} onClick={() => { if (confirm(`לדחות את "${p.name}"?`)) start(async () => {
                  const res = await declineDraft(r.id);
                  setDone(x => ({ ...x, [r.id]: res.ok ? { kind: 'no' } : { kind: 'err', msg: res.error } }));
                }); }}>דחייה</button>
              </div>
            </section>
          );
        })}
        {open.length === 0 && <p className="adm-hint">זהו, טיפלת בכולן.</p>}
      </div>
    </TextsProvider>
  );
}
