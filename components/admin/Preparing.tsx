'use client';
import { useState, useTransition } from 'react';
import { markSubmission } from '@/app/admin/actions';

type Row = { id: number; name: string; where: string; what: string; created_at: string };
const when = (s: string) => new Date(s).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem', day: 'numeric', month: 'numeric' });

// Visitors' suggestions waiting for the morning run. One that is clearly not a pearl can be closed right away.
export default function Preparing({ rows }: { rows: Row[] }) {
  const [closed, setClosed] = useState<number[]>([]);
  const [busy, start] = useTransition();
  return (
    <div className="adm-queue">
      {rows.filter(r => !closed.includes(r.id)).map(r => (
        <div key={r.id} className="adm-qitem still">
          <span><b>{r.name}</b><small>{[r.where, r.what, `הגיעה ב-${when(r.created_at)}`].filter(Boolean).join(' · ')}</small></span>
          <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => { if (confirm(`לסגור את ההצעה "${r.name}" בלי להכין אותה?`)) start(async () => { await markSubmission(r.id, 'done'); setClosed(c => [...c, r.id]); }); }}>לא מתאים</button>
        </div>
      ))}
    </div>
  );
}
