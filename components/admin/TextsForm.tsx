'use client';
import { useState, useTransition } from 'react';
import { DEFAULT_TEXTS, TEXT_DEFAULTS, TEXT_KEYS, type TextKey, type Texts } from '@/lib/texts';
import { saveSiteTexts } from '@/app/admin/actions';

// One field per site text (popup, map tip, notes). "ברירת מחדל" puts the original wording back in the field.
export default function TextsForm({ initial }: { initial: Texts }) {
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
        <p className="adm-hint">הטקסטים שמופיעים באתר מחוץ לכרטיסי הפנינים. שינוי נשמר רק אחרי לחיצה על "שמירה".</p>
        {TEXT_KEYS.map(k => {
          const d = TEXT_DEFAULTS[k] as { label: string; multi?: boolean; hint?: string };
          return (
            <label key={k}>
              {d.label}
              <textarea rows={d.multi ? 4 : 1} value={t[k]} onChange={e => set(k, e.target.value)} />
              <span className="adm-row">
                {d.hint && <span className="adm-hint">{d.hint}</span>}
                {t[k] !== DEFAULT_TEXTS[k] && <button type="button" className="adm-btn ghost" onClick={() => set(k, DEFAULT_TEXTS[k])}>ברירת מחדל</button>}
              </span>
            </label>
          );
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
