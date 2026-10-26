'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { StoredPlace } from '@/lib/store';
import { CATS } from '@/lib/config';
import { quickSave, type QuickPatch } from '@/app/admin/actions';

// Pick, main category (cats[0] = the card's icon) and "checked by hand" are changed right in the row and saved at once.
export default function AdminList({ places }: { places: StoredPlace[] }) {
  const [q, setQ] = useState('');
  const [show, setShow] = useState<'all' | 'hidden' | 'pick' | 'town' | 'unchecked'>('all');
  const [over, setOver] = useState<Record<number, Partial<StoredPlace>>>({});
  const [busy, setBusy] = useState<Record<number, boolean>>({});
  const [err, setErr] = useState('');
  const rows = useMemo(() => places.map(p => over[p.id] ? { ...p, ...over[p.id] } : p), [places, over]);
  const list = useMemo(() => rows.filter(p => {
    if (show === 'hidden' && !p.hidden) return false;
    if (show === 'pick' && !p.pick) return false;
    if (show === 'town' && p.precision === 'exact') return false;
    if (show === 'unchecked' && p.checked) return false;
    const s = `${p.name} ${p.town || ''} ${p.region.join(' ')} ${p.cats.join(' ')}`.toLowerCase();
    return !q || s.includes(q.toLowerCase());
  }), [rows, q, show]);

  const quick = async (p: StoredPlace, patch: QuickPatch) => {
    const next: Partial<StoredPlace> = {
      ...(patch.pick !== undefined ? { pick: patch.pick } : {}),
      ...(patch.checked !== undefined ? { checked: patch.checked } : {}),
      ...(patch.primary ? { cats: [patch.primary, ...p.cats.filter(c => c !== patch.primary)] } : {}),
    };
    const prev = over[p.id];
    setOver(o => ({ ...o, [p.id]: { ...o[p.id], ...next } }));
    setBusy(b => ({ ...b, [p.id]: true }));
    setErr('');
    const r = await quickSave(p.id, patch).catch(() => ({ ok: false as const, error: 'אין חיבור, נסי שוב' }));
    setBusy(b => ({ ...b, [p.id]: false }));
    if (!r.ok) {
      setOver(o => ({ ...o, [p.id]: prev ?? {} }));
      setErr(`"${p.name}" לא נשמר: ${r.error}`);
    }
  };

  const tab = (k: typeof show, label: string) => <button type="button" className="chip" aria-pressed={show === k} onClick={() => setShow(k)}>{label}</button>;
  return (
    <div className="adm-card">
      <div className="adm-row">
        <input type="search" placeholder="חיפוש לפי שם, יישוב, אזור..." value={q} onChange={e => setQ(e.target.value)} />
        {tab('all', `הכול (${rows.length})`)}
        {tab('hidden', `מוסתרים (${rows.filter(p => p.hidden).length})`)}
        {tab('pick', `המלצת המערכת (${rows.filter(p => p.pick).length})`)}
        {tab('unchecked', `לא נבדקו ידנית (${rows.filter(p => !p.checked).length})`)}
        {tab('town', 'מיקום משוער')}
      </div>
      <p className="adm-hint">ההמלצה, הקטגוריה העיקרית (האייקון בכרטיס) ו"נבדק ידנית" נשמרים מיד כשמשנים אותם בשורה.</p>
      {err && <p className="adm-err" role="alert">{err}</p>}
      <table className="adm-table">
        <thead><tr><th>שם</th><th>יישוב</th><th>אזור</th><th>קטגוריה עיקרית</th><th>★ המלצה</th><th>נבדק ידנית</th><th>שבת</th><th>משפחות</th><th>מיקום</th><th></th></tr></thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id} className={p.hidden ? 'off' : ''} aria-busy={busy[p.id] || undefined}>
              <td>{p.pick && '★ '}<Link href={`/admin/p/${p.id}`}>{p.name}</Link>{p.hidden && <span className="adm-tag">מוסתר</span>}</td>
              <td>{p.town}</td>
              <td>{p.region.join(', ')}</td>
              <td>
                <select className="adm-sel" value={p.cats[0] || ''} aria-label={`קטגוריה עיקרית של ${p.name}`}
                  onChange={e => e.target.value && quick(p, { primary: e.target.value })}>
                  {!p.cats.length && <option value="">בחירה...</option>}
                  {p.cats.map(c => <option key={c} value={c}>{c}</option>)}
                  {p.cats.length < CATS.length && (
                    <optgroup label="להוסיף קטגוריה ולהפוך אותה לעיקרית">
                      {CATS.filter(c => !p.cats.includes(c)).map(c => <option key={c} value={c}>{c}</option>)}
                    </optgroup>
                  )}
                </select>
                {p.cats.length > 1 && <div className="adm-more">גם: {p.cats.slice(1).join(', ')}</div>}
              </td>
              <td className="adm-c"><input type="checkbox" checked={p.pick} aria-label={`המלצת המערכת: ${p.name}`} onChange={e => quick(p, { pick: e.target.checked })} /></td>
              <td className="adm-c"><input type="checkbox" checked={!!p.checked} aria-label={`נבדק ידנית: ${p.name}`} onChange={e => quick(p, { checked: e.target.checked })} /></td>
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
