'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { StoredPlace } from '@/lib/store';

export default function AdminList({ places }: { places: StoredPlace[] }) {
  const [q, setQ] = useState('');
  const [show, setShow] = useState<'all' | 'hidden' | 'pick' | 'town'>('all');
  const list = useMemo(() => places.filter(p => {
    if (show === 'hidden' && !p.hidden) return false;
    if (show === 'pick' && !p.pick) return false;
    if (show === 'town' && p.precision === 'exact') return false;
    const s = `${p.name} ${p.town || ''} ${p.region.join(' ')} ${p.cats.join(' ')}`.toLowerCase();
    return !q || s.includes(q.toLowerCase());
  }), [places, q, show]);
  const tab = (k: typeof show, label: string) => <button type="button" className="chip" aria-pressed={show === k} onClick={() => setShow(k)}>{label}</button>;
  return (
    <div className="adm-card">
      <div className="adm-row">
        <input type="search" placeholder="חיפוש לפי שם, יישוב, אזור..." value={q} onChange={e => setQ(e.target.value)} />
        {tab('all', `הכול (${places.length})`)}
        {tab('hidden', `מוסתרים (${places.filter(p => p.hidden).length})`)}
        {tab('pick', 'המלצת המערכת')}
        {tab('town', 'מיקום משוער')}
      </div>
      <table className="adm-table">
        <thead><tr><th>שם</th><th>יישוב</th><th>אזור</th><th>קטגוריות</th><th>שבת</th><th>משפחות</th><th>מיקום</th><th></th></tr></thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id} className={p.hidden ? 'off' : ''}>
              <td>{p.pick && '★ '}<Link href={`/admin/p/${p.id}`}>{p.name}</Link>{p.hidden && <span className="adm-tag">מוסתר</span>}</td>
              <td>{p.town}</td>
              <td>{p.region.join(', ')}</td>
              <td>{p.cats.join(', ')}</td>
              <td>{p.shabbat === 'open' ? 'פתוח' : p.shabbat === 'closed' ? 'סגור' : '—'}</td>
              <td>{p.family === 'yes' ? 'כן' : p.family === 'no' ? 'לא' : '—'}</td>
              <td>{p.lat == null ? '—' : p.precision === 'exact' ? 'מדויק' : 'משוער'}</td>
              <td><Link href={`/admin/p/${p.id}`}>עריכה</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
