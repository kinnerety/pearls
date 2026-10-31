'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Place } from '@/lib/types';
import type { Texts } from '@/lib/texts';
import { CATS, ZONES } from '@/lib/config';
import { slugOf } from '@/lib/slug';
import { acceptDraft, declineDraft, geocode, markSubmission, remove, save, type GeoHit } from '@/app/admin/actions';
import DraftSide, { type DraftInfo } from './DraftSide';

const PinMap = dynamic(() => import('./PinMap'), { ssr: false, loading: () => <div className="adm-map" /> });

export type ReportInfo = { id: number; what: string; when: string };

// draft: the form edits a pending new pearl (area "פנינים חדשות"): beside it the card as it will look and its sources;
// approving saves it as a real place and opens the next pearl in line.
// report: a visitor's mistake report about this place, shown above the fields and marked handled on save.
// Every save goes back to the list it came from (Kinneret, 30.10.2026).
export default function PlaceForm({ initial, hidden, updatedAt, draft, texts, report, notice }: {
  initial: Place; hidden: boolean; updatedAt?: string; draft?: DraftInfo; texts?: Texts; report?: ReportInfo; notice?: string;
}) {
  const draftId = draft?.id;
  const [p, setP] = useState<Place>(initial);
  const [closing, setClosing] = useState(false);
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
  // a new spot from the map or the search replaces the saved address and source, so the text under the map never describes an old point
  const setLoc = (lat: number, lng: number, precision: 'exact' | 'town', hit?: GeoHit) =>
    setP(x => ({ ...x, lat, lng, precision, approx: precision !== 'exact',
      geo_source: !hit ? 'עודכן בדף הניהול' : hit.url ? `Google Maps: ${hit.name} · ${hit.url}` : `חיפוש בדף הניהול: ${hit.name}`,
      address: hit ? (hit.address || hit.name) : undefined } as Place));

  const search = (text: string) => start(async () => { setHits(await geocode(text)); });
  const submit = () => start(async () => {
    const split = (t: string) => t.split(/[,،]/).map(s => s.trim()).filter(Boolean);
    const place: Place = { ...p, tags: split(tags), types: split(types) };
    const r = draftId ? await acceptDraft(draftId, place) : await save(place, hidden);
    if (!r.ok) { setErrors(r.errors); setMsg(''); return; }
    setErrors([]); setMsg('נשמר ✓');
    if (report) await markSubmission(report.id, 'done');
    const ok = `?ok=${encodeURIComponent(place.name)}`;
    if (draft) router.push(draft.next ? `/admin/drafts/${draft.next}${ok}` : `/admin/drafts${ok}`);
    else router.push(`/admin/places${ok}`);
  });
  // "המקום נסגר": the pearl leaves the site but stays in the list (hidden), and can come back
  const setLive = (live: boolean) => start(async () => {
    const r = await save({ ...p, tags: tags.split(/[,،]/).map(x => x.trim()).filter(Boolean), types: types.split(/[,،]/).map(x => x.trim()).filter(Boolean) }, !live);
    if (!r.ok) { setErrors(r.errors); return; }
    router.push(`/admin/places?${live ? 'back' : 'closed'}=${encodeURIComponent(p.name)}`);
  });
  const reject = () => { if (draft && confirm(`להוריד את "${p.name}" מהרשימה בלי להעלות לאתר?`)) start(async () => {
    const r = await declineDraft(draft.id);
    if (!r.ok) { setErrors([r.error]); return; }
    const no = `?no=${encodeURIComponent(p.name)}`;
    router.push(draft.next ? `/admin/drafts/${draft.next}${no}` : `/admin/drafts${no}`);
  }); };
  const back = draft || isNew ? '/admin/drafts' : '/admin/places';

  const form = (
    <div className="adm-form">
      <div className="adm-crumb">
        <Link href={back}>{draft ? '→ חזרה לרשימת הממתינות' : isNew ? '→ חזרה לפנינים החדשות' : '→ חזרה לפנינים באתר'}</Link>
        {draft && draft.total > 0 && <span>פנינה {draft.pos} מתוך {draft.total}</span>}
      </div>
      {notice && <p className="adm-toast">{notice}</p>}
      <div className="adm-top">
        <h1>{isNew && !draft ? 'פנינה חדשה' : p.name || 'עריכה'}</h1>
        {!isNew && <Link className="adm-btn ghost" href={`/p/${slugOf(initial)}`} target="_blank">לראות באתר</Link>}
      </div>
      {hidden && <p className="adm-report">הפנינה הזאת מוסתרת מהאתר (המקום נסגר). <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => setLive(true)}>להחזיר לאתר</button></p>}
      {report && <div className="adm-report"><b>הדיווח ({new Date(report.when).toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem' })})</b><span>{report.what}</span><span className="adm-hint">אחרי השמירה הדיווח יסומן "טופל".</span></div>}

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
      </section>

      <section className="adm-card">
        <h2>מיקום</h2>
        <p className="adm-hint">אפשר לחפש בגוגל מפס שם מקום או כתובת (כמו בגוגל מפס עצמו), ללחוץ על המפה, או לגרור את הנקודה. בלי מיקום מדויק, הנקודה תוצג במרכז היישוב.</p>
        <div className="adm-row">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="כתובת או שם המקום" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); search(q || `${p.name} ${p.town}`); } }} />
          <button type="button" className="adm-btn" disabled={busy} onClick={() => search(q || `${p.name} ${p.town}`)}>חיפוש מיקום</button>
          {p.town && <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => start(async () => {
            const h = (await geocode(p.town)).find(x => x.kind === 'town') || (await geocode(p.town))[0];
            if (h) { setLoc(h.lat, h.lng, 'town', h); setHits(null); } else setHits([]);
          })}>רק מרכז היישוב</button>}
        </div>
        {hits && (hits.length ? <ul className="adm-hits">{hits.map((h, i) => <li key={i}><button type="button" onClick={() => { setLoc(h.lat, h.lng, h.kind, h); setHits(null); }}>{h.name}{h.address && h.address !== h.name && <small> · {h.address}</small>}</button></li>)}</ul> : <p className="adm-hint">גוגל מפס לא מצא. נסי ניסוח אחר (כמו שמחפשים בגוגל מפס), או לחצי על המפה.</p>)}
        <LocNow p={p} />
        <PinMap lat={p.lat} lng={p.lng} onMove={(la, ln) => setLoc(la, ln, 'exact')} />
      </section>

      <div className="adm-save">
        {errors.length > 0 && <ul className="adm-err">{errors.map(e => <li key={e}>{e}</li>)}</ul>}
        {msg && <p className="adm-ok">{msg}</p>}
        {closing && (
          <div className="adm-confirm">
            <b>להוריד את "{p.name}" מהאתר?</b>
            <span className="adm-hint">הפנינה לא נמחקת, רק מוסתרת. אפשר להחזיר אותה בכל רגע מהרשימה.</span>
            <div className="adm-row">
              <button type="button" className="adm-btn" disabled={busy} onClick={() => setLive(false)}>כן, המקום נסגר</button>
              <button type="button" className="adm-btn ghost" onClick={() => setClosing(false)}>ביטול</button>
            </div>
          </div>
        )}
        <div className="adm-row">
          <button type="button" className="adm-btn" disabled={busy} onClick={submit}>{busy ? 'שומר...' : draft ? 'אישור, לעלות לאתר' : 'שמירה'}</button>
          {draft && <button type="button" className="adm-btn ghost" disabled={busy} onClick={reject}>לא מתאים</button>}
          {draft && <span className="adm-hint">אחרי האישור עוברים לבאה בתור</span>}
          <span className="adm-sp" />
          {!isNew && !hidden && <button type="button" className="adm-btn ghost" disabled={busy} onClick={() => setClosing(true)}>המקום נסגר</button>}
          {!isNew && <button type="button" className="adm-btn danger" disabled={busy} onClick={() => { if (confirm(`למחוק את "${p.name}" לצמיתות? בדרך כלל עדיף "המקום נסגר", שאפשר להחזיר.`)) start(() => remove(p.id)); }}>מחיקה</button>}
        </div>
        {updatedAt && <p className="adm-hint">עודכן לאחרונה: {new Date(updatedAt).toLocaleString('he-IL')}</p>}
      </div>
    </div>
  );
  if (!draft) return form;
  return (
    <div className="adm-review">
      {form}
      <DraftSide p={p} info={draft} texts={texts} />
    </div>
  );
}

// What the map shows right now, in words (Kinneret, 31.10.2026): the place Google found and its address, a spot she searched
// for, a point she marked by hand, or the town centre; plus the coordinates and a link to open the same spot in Google Maps.
// Above the map (Kinneret, 31.10); the address is Google's full formatted address, street and number included when it has one.
function LocNow({ p }: { p: Place }) {
  if (p.lat == null || p.lng == null) return <p className="adm-hint">אין עדיין מיקום</p>;
  const src = p.geo_source || '';
  const google = src.match(/^Google Maps: (.*?)(?: · (https?:\S+))?$/);
  const searched = src.match(/^חיפוש בדף הניהול: (.*)$/);
  const what = p.precision !== 'exact' ? `מרכז היישוב${p.town ? ` ${p.town}` : ''}`
    : google ? google[1] : searched ? searched[1] : src === 'עודכן בדף הניהול' ? 'נקודה שסומנה ידנית על המפה' : src || 'מיקום מדויק';
  const url = google?.[2] || `https://www.google.com/maps?q=${p.lat},${p.lng}`;
  return (
    <div className="adm-loc">
      <p><b>על המפה עכשיו:</b> {what}</p>
      {p.address && p.address !== what && <p className="adm-loc-addr">{p.address}</p>}
      <p className="adm-hint">{p.precision === 'exact' ? 'מיקום מדויק' : 'מיקום משוער'} · {p.lat}, {p.lng} · <a href={url} target="_blank" rel="noopener">לפתוח בגוגל מפות ↗</a></p>
    </div>
  );
}
