'use client';
import { useState, useTransition } from 'react';
import { DEFAULT_TEXTS, TEXT_DEFAULTS, TEXT_KEYS, faqText, parseFaq, type Faq, type TextKey, type Texts } from '@/lib/texts';
import { saveSiteTexts } from '@/app/admin/actions';
import { shareText } from '@/lib/share';
import type { Place } from '@/lib/types';

// A made-up place, only to show how a shared message will look with the current wording
const SAMPLE = { id: 0, name: 'שם הפנינה', town: '', region: ['גליל עליון'], cats: [], types: [], tags: [], ctags: [], link: 'https://example.co.il', descr: 'המשפט הראשון של התיאור. ועוד משפט.', lat: null, lng: null, approx: true, shabbat: 'unknown', family: 'unknown', pick: false } satisfies Place;

// One field per site text (popup, map tip, notes). "ברירת מחדל" puts the original wording back in the field.
export default function TextsForm({ initial, keys = TEXT_KEYS, hint = 'הטקסטים שמופיעים באתר מחוץ לכרטיסי הפנינים. שינוי נשמר רק אחרי לחיצה על "שמירה".', placeholders = {} }: { initial: Texts; keys?: TextKey[]; hint?: string; placeholders?: Partial<Record<TextKey, string>> }) {
  const [faqReset, setFaqReset] = useState(0);
  const [t, setT] = useState<Texts>(initial);
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, start] = useTransition();
  const set = (k: TextKey, v: string) => { setT(x => ({ ...x, [k]: v })); setMsg(''); };
  const submit = () => start(async () => {
    const r = await saveSiteTexts(t);
    if (!r.ok) { setErrors(r.errors); setMsg(''); return; }
    setErrors([]); setMsg('נשמר ✓ האתר מתעדכן תוך כמה שניות');
  });
  return (
    <>
      <section className="adm-card">
        <p className="adm-hint">{hint}</p>
        {keys.map(k => {
          const d = TEXT_DEFAULTS[k] as { label: string; multi?: boolean; big?: boolean; hint?: string; faq?: boolean };
          if (d.faq) return (
            <div key={k} className="adm-faq">
              <b>{d.label}</b>
              <FaqEditor key={faqReset} initial={t[k]} onChange={v => set(k, v)} />
              {t[k] !== DEFAULT_TEXTS[k] && <span className="adm-row"><button type="button" className="adm-btn ghost" onClick={() => { set(k, DEFAULT_TEXTS[k]); setFaqReset(n => n + 1); }}>ברירת מחדל</button></span>}
            </div>
          );
          const field = (
            <label key={k}>
              {d.label}
              <textarea rows={d.big ? 24 : d.multi ? 4 : 1} value={t[k]} placeholder={placeholders[k]} onChange={e => set(k, e.target.value)} />
              <span className="adm-row">
                {d.hint && <span className="adm-hint">{d.hint}</span>}
                {t[k] !== DEFAULT_TEXTS[k] && <button type="button" className="adm-btn ghost" onClick={() => set(k, DEFAULT_TEXTS[k])}>ברירת מחדל</button>}
              </span>
            </label>
          );
          if (k !== 'share.site') return field;
          return [field, (
            <div key="share-preview">
              <b>כך תיראה הודעת שיתוף (דוגמה):</b>
              <p className="adm-preview" dir="rtl">{shareText(SAMPLE, 'https://pninim-il.co.il', t)}</p>
            </div>
          )];
        })}
      </section>
      <div className="adm-save">
        {errors.length > 0 && <ul className="adm-err">{errors.map(e => <li key={e}>{e}</li>)}</ul>}
        {msg && <p className="adm-ok">{msg}</p>}
        <div className="adm-row"><button type="button" className="adm-btn" disabled={busy} onClick={submit}>{busy ? 'שומר...' : 'שמירה'}</button></div>
      </div>
    </>
  );
}

// Questions and answers as separate fields, with buttons to add, remove and move them; stored as one text ("### question" + answer lines)
function FaqEditor({ initial, onChange }: { initial: string; onChange: (v: string) => void }) {
  const [items, setItems] = useState<Faq[]>(() => parseFaq(initial));
  const update = (next: Faq[]) => { setItems(next); onChange(faqText(next)); };
  const edit = (i: number, f: Partial<Faq>) => update(items.map((x, j) => j === i ? { ...x, ...f } : x));
  const move = (i: number, d: number) => { const n = [...items]; [n[i], n[i + d]] = [n[i + d], n[i]]; update(n); };
  return (
    <>
      {items.map((f, i) => (
        <div key={i} className="adm-faq-item">
          <label>שאלה {i + 1}<input value={f.q} onChange={e => edit(i, { q: e.target.value })} /></label>
          <label>תשובה<textarea rows={3} value={f.a} onChange={e => edit(i, { a: e.target.value })} /></label>
          <span className="adm-row">
            {i > 0 && <button type="button" className="adm-btn ghost" onClick={() => move(i, -1)}>↑ למעלה</button>}
            {i < items.length - 1 && <button type="button" className="adm-btn ghost" onClick={() => move(i, 1)}>↓ למטה</button>}
            <button type="button" className="adm-btn danger" onClick={() => { if (confirm('למחוק את השאלה הזאת?')) update(items.filter((_, j) => j !== i)); }}>מחיקה</button>
          </span>
        </div>
      ))}
      <span className="adm-row"><button type="button" className="adm-btn" onClick={() => setItems([...items, { q: '', a: '' }])}>+ שאלה ותשובה חדשה</button></span>
    </>
  );
}
