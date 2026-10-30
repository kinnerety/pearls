'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { markSubmission, removeSubmission } from '@/app/admin/actions';

type Row = { id: number; place: string; placeId: number | null; what: string; email: string; created_at: string };
const when = (s: string) => new Date(s).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric' });

// "דיווח על טעות" from the site's form. "לתקן" opens the pearl with the report above its fields (saving marks it handled).
export default function Reports({ rows }: { rows: Row[] }) {
  const [gone, setGone] = useState<number[]>([]);
  const [busy, start] = useTransition();
  const list = rows.filter(r => !gone.includes(r.id));
  if (!list.length) return null;
  const drop = (id: number, del: boolean) => start(async () => { if (del) await removeSubmission(id); else await markSubmission(id, 'done'); setGone(g => [...g, id]); });
  return (
    <section className="adm-reports">
      <h2>דיווחים על טעויות ({list.length})</h2>
      {list.map(r => (
        <div key={r.id} className="adm-rep">
          <span><b>{r.place || 'כללי (לא פנינה מסוימת)'}</b>: {r.what}<small>{when(r.created_at)}{r.email && <> · <a href={`mailto:${r.email}`} dir="ltr">{r.email}</a></>}</small></span>
          <span className="adm-row">
            {r.placeId && <Link className="adm-btn" href={`/admin/p/${r.placeId}?report=${r.id}`}>לתקן ←</Link>}
            <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => drop(r.id, false)}>טופל</button>
            <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => { if (confirm('למחוק את הדיווח?')) drop(r.id, true); }}>מחיקה</button>
          </span>
        </div>
      ))}
    </section>
  );
}
