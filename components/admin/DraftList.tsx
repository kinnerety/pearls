'use client';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { publishDraft } from '@/app/admin/actions';

type Row = { key: string; name: string; town: string; cats: string[]; exists: boolean };

export default function DraftList({ rows }: { rows: Row[] }) {
  const [done, setDone] = useState<Record<string, number | string>>({});
  const [busy, start] = useTransition();
  if (!rows.length) return <p className="adm-hint">אין טיוטות כרגע.</p>;
  return (
    <table className="adm-table">
      <thead><tr><th>שם</th><th>יישוב</th><th>קטגוריות</th><th></th></tr></thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.key}>
            <td><Link href={`/draft/${r.key}`} target="_blank">{r.name}</Link></td>
            <td>{r.town}</td>
            <td>{r.cats.join(', ')}</td>
            <td>
              {typeof done[r.key] === 'number' ? <Link className="adm-btn ghost" href={`/admin/p/${done[r.key]}`}>נוספה ✓ לעריכה</Link>
                : typeof done[r.key] === 'string' ? <span className="adm-err">{done[r.key]}</span>
                : r.exists ? <span className="adm-tag">כבר באתר</span>
                : <button type="button" className="adm-btn" disabled={busy} onClick={() => start(async () => {
                  const res = await publishDraft(r.key);
                  setDone(d => ({ ...d, [r.key]: res.ok ? res.id : res.errors.join(', ') }));
                })}>הוספה לאתר</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
