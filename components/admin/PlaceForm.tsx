'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Place } from '@/lib/types';
import { CATS, ZONES } from '@/lib/config';
import { slugOf } from '@/lib/slug';
import { geocode, remove, save, type GeoHit } from '@/app/admin/actions';

const PinMap = dynamic(() => import('./PinMap'), { ssr: false, loading: () => <div className="adm-map" /> });

export default function PlaceForm({ initial, hidden: hidden0, updatedAt }: { initial: Place; hidden: boolean; updatedAt?: string }) {
  const [p, setP] = useState<Place>(initial);
  const [hidden, setHidden] = useState(hidden0);
  const [tags, setTags] = useState(initial.tags.join(', '));
  const [types, setTypes] = useState((initial.types || []).join(', '));
  const [errors, setErrors] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<GeoHit[] | null>(null);
  const [busy, start] = useTransition();
  const router = useRouter();
  const isNew = !initial.id;
  const set = <K extends keyof Place>(k: K, v: Place[K]) => { setP(x => ({ ...x, [k]: v })); setMsg(''); };
  const toggle = (k: 'region' | 'cats', v: string) => set(k, p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v]);
  const setLoc = (lat: number, lng: number, precision: 'exact' | 'town', address?: string) =>
    setP(x => ({ ...x, lat, lng, precision, approx: precision !== 'exact', geo_source: 'עודכן בדף הניהול', ...(address ? { address } : {}) } as Place));

  const search = (text: string) => start(async () => { setHits(await geocode(text)); });
  const submit = () => start(async () => {
    const split = (t: string) => t.split(/[,،]/).map(s => s.trim()).filter(Boolean);
    const place: Place = { ...p, tags: split(tags), types: split(types) };
    const r = await save(place, hidden);
    if (!r.ok) { setErrors(r.errors); setMsg(''); return; }
    setErrors([]); setMsg('נשמר ✓ האתר מתעדכן תוך כמה שניות');
    if (isNew) router.replace(`/admin/p/${r.id}`); else router.refresh();
  });

  return (
    <div className="adm-form">
      <div className="adm-top">
        <h1>{isNew ? 'פנינה חדשה' : p.name || 'עריכה'}</h1>
        <div className="adm-row">
          <Link className="adm-btn ghost" href="/admin">→ לרשימה</Link>
          {!isNew && <Link className="adm-btn ghost" href={`/p/${slugOf(initial)}`} target="_blank">לדף באתר</Link>}
        </div>
      </div>

      <section className="adm-card">
        <label>שם<input value={p.name} onChange={e => set('name', e.target.value)} required /></label>
        <label>יישוב<input value={p.town || ''} onChange={e => set('town', e.target.value)} /></label>
        <label>קישור (אתר המקום, ואם אין אז פייסבוק/אינסטגרם)<input dir="ltr" value={p.link} onChange={e => set('link', e.target.value)} placeholder="https://" /></label>
        <label>תיאור<textarea rows={4} value={p.descr} onChange={e => set('descr', e.target.value)} /></label>
        <label>הערה צהובה על הכרטיס (לא חובה)<input value={p.note || ''} onChange={e => set('note', e.target.value || undefined)} /></label>
        <label>סוגים (מופרדים בפסיק, לחיפוש: יקב, גבינות, חנות מעניינת...)<input value={types} onChange={e => setTypes(e.target.value)} /></label>
        <label>תגיות (מופרדות בפסיק, לחיפוש)<input value={tags} onChange={e => setTags(e.target.value)} /></label>
        <label>שעות פתיחה ומידע מעשי (שמור במאגר, לא מוצג באתר כרגע)<input value={p.hours || ''} onChange={e => set('hours', e.target.value || undefined)} /></label>
      </section>

      <section className="adm-card">
        <h2>אזור</h2>
        {Object.keys(ZONES).map(z => (
          <div className="adm-row" key={z}><b className="adm-zone">{z}</b>
            {ZONES[z].map(r => <button type="button" key={r} className="chip sm" aria-pressed={p.region.includes(r)} onClick={() => toggle('region', r)}>{r}</button>)}
          </div>
        ))}
        <h2>קטגוריות</h2>
        <div className="adm-row">{CATS.map(c => <button type="button" key={c} className="chip" aria-pressed={p.cats.includes(c)} onClick={() => toggle('cats', c)}>{c}</button>)}</div>
        {p.cats.length > 1 && (
          <div className="adm-row"><b>הקטגוריה הראשית (האייקון של הכרטיס):</b>
            {/* the first category is the one whose illustration the card and the map marker show */}
            {p.cats.map((c, i) => <button type="button" key={c} className="chip sm" aria-pressed={i === 0} onClick={() => set('cats', [c, ...p.cats.filter(x => x !== c)])}>{c}</button>)}
          </div>
        )}
      </section>

      <section className="adm-card">
        <h2>שבת ומשפחות</h2>
        <div className="adm-row"><b>שבת:</b>
          {([['open', 'פתוח בשבת'], ['closed', 'סגור בשבת'], ['unknown', 'לא ידוע']] as const).map(([v, l]) => <button type="button" key={v} className="chip" aria-pressed={p.shabbat === v} onClick={() => set('shabbat', v)}>{l}</button>)}
        </div>
        <div className="adm-row"><b>משפחות:</b>
          {([['yes', 'גם למשפחות'], ['no', 'לא'], ['unknown', 'לא ידוע']] as const).map(([v, l]) => <button type="button" key={v} className="chip" aria-pressed={p.family === v} onClick={() => set('family', v)}>{l}</button>)}
        </div>
        <label className="adm-check"><input type="checkbox" checked={p.pick} onChange={e => set('pick', e.target.checked)} /> ★ המלצת המערכת</label>
        <label className="adm-check"><input type="checkbox" checked={!!p.checked} onChange={e => set('checked', e.target.checked)} /> נבדק ידנית</label>
        <label className="adm-check"><input type="checkbox" checked={hidden} onChange={e => setHidden(e.target.checked)} /> נסגר / להסתיר מהאתר</label>
      </section>

      <section className="adm-card">
        <h2>מיקום</h2>
        <p className="adm-hint">אפשר לחפש כתובת או שם מקום, ללחוץ על המפה, או לגרור את הנקודה. בלי מיקום מדויק, הנקודה תוצג באתר כ"מיקום משוער, בתוך היישוב".</p>
        <div className="adm-row">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="כתובת או שם המקום" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); search(q || `${p.name} ${p.town}`); } }} />
          <button type="button" className="adm-btn" disabled={busy} onClick={() => search(q || `${p.name} ${p.town}`)}>חיפוש מיקום</button>
          {p.town && <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => start(async () => {
            const h = (await geocode(p.town)).find(x => x.kind === 'town') || (await geocode(p.town))[0];
            if (h) { setLoc(h.lat, h.lng, 'town'); setHits(null); } else setHits([]);
          })}>רק מרכז היישוב</button>}
        </div>
        {hits && (hits.length ? <ul className="adm-hits">{hits.map((h, i) => <li key={i}><button type="button" onClick={() => { setLoc(h.lat, h.lng, h.kind === 'town' ? 'town' : 'exact', q || undefined); setHits(null); }}>{h.name}</button></li>)}</ul> : <p className="adm-hint">לא נמצא. נסי ניסוח אחר, או לחצי על המפה.</p>)}
        <PinMap lat={p.lat} lng={p.lng} onMove={(la, ln) => setLoc(la, ln, 'exact')} />
        <p className="adm-hint">{p.lat == null ? 'אין עדיין מיקום' : `${p.precision === 'exact' ? 'מיקום מדויק' : 'מיקום משוער (מרכז היישוב)'} · ${p.lat}, ${p.lng}`}</p>
      </section>

      <div className="adm-save">
        {errors.length > 0 && <ul className="adm-err">{errors.map(e => <li key={e}>{e}</li>)}</ul>}
        {msg && <p className="adm-ok">{msg}</p>}
        <div className="adm-row">
          <button type="button" className="adm-btn" disabled={busy} onClick={submit}>{busy ? 'שומר...' : 'שמירה'}</button>
          {!isNew && <button type="button" className="adm-btn danger" disabled={busy} onClick={() => { if (confirm(`למחוק את "${p.name}" לצמיתות? (אפשר במקום זה לסמן "נסגר / להסתיר")`)) start(() => remove(p.id)); }}>מחיקה</button>}
        </div>
        {updatedAt && <p className="adm-hint">עודכן לאחרונה: {new Date(updatedAt).toLocaleString('he-IL')}</p>}
      </div>
    </div>
  );
}
