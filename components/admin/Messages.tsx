'use client';
import { useState, useTransition } from 'react';
import { markSubmission, removeSubmission } from '@/app/admin/actions';

type Row = { id: number; name: string; email: string; message: string; created_at: string };
const when = (s: string) => new Date(s).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric' });

// "משהו אחר" from the contact form (Kinneret, 30.10.2026): name, email and the message, with "טופל" / delete like the reports
export default function Messages({ rows }: { rows: Row[] }) {
  const [gone, setGone] = useState<number[]>([]);
  const [busy, start] = useTransition();
  const list = rows.filter(r => !gone.includes(r.id));
  if (!list.length) return null;
  const drop = (id: number, del: boolean) => start(async () => { if (del) await removeSubmission(id); else await markSubmission(id, 'done'); setGone(g => [...g, id]); });
  return (
    <section className="adm-reports">
      <h2>פניות מטופס יצירת הקשר ({list.length})</h2>
      {list.map(r => (
        <div key={r.id} className="adm-rep">
          <span><b>{r.name}</b>: {r.message}<small>{when(r.created_at)} · <a href={`mailto:${r.email}`} dir="ltr">{r.email}</a></small></span>
          <span className="adm-row">
            <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => drop(r.id, false)}>טופל</button>
            <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => { if (confirm('למחוק את הפנייה?')) drop(r.id, true); }}>מחיקה</button>
          </span>
        </div>
      ))}
    </section>
  );
}
