'use client';
import { useState, useTransition, type ReactNode } from 'react';
import { DEFAULT_TEXTS, TEXT_DEFAULTS, type TextKey, type Texts } from '@/lib/texts';
import { saveSiteTexts } from '@/app/admin/actions';
import { EditProvider } from '@/components/EditText';
import TextsForm from './TextsForm';

// The site's texts edited where they are (Kinneret, 30.10.2026): the real popup, map tip or forms are rendered on the
// admin page and every text in them can be clicked and changed. Texts with no place to show go in plain fields below.
export default function LiveTexts({ initial, keys, fields = [], children }: { initial: Texts; keys: TextKey[]; fields?: TextKey[]; children: ReactNode }) {
  const [t, setT] = useState<Texts>(initial);
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, start] = useTransition();
  const set = (k: TextKey, v: string) => { setT(x => ({ ...x, [k]: v })); setMsg(''); };
  const changed = keys.filter(k => t[k] !== DEFAULT_TEXTS[k]);
  const dirty = keys.some(k => t[k] !== initial[k]);
  const submit = () => start(async () => {
    const r = await saveSiteTexts(Object.fromEntries(keys.map(k => [k, t[k]])) as Partial<Texts>);
    if (!r.ok) { setErrors(r.errors); setMsg(''); return; }
    setErrors([]); setMsg('נשמר ✓ האתר מתעדכן תוך כמה שניות');
  });
  return (
    <>
      <p className="adm-hint">לחיצה על כל טקסט פותחת אותו לעריכה במקום. טקסט שצבוע בצהוב שונה מברירת המחדל. שינוי נשמר רק אחרי לחיצה על "שמירה".</p>
      <EditProvider value={{ texts: t, set }}>
        <div className="adm-live">{children}</div>
      </EditProvider>
      {changed.length > 0 && (
        <details className="adm-changed">
          <summary>טקסטים ששונו מברירת המחדל ({changed.length})</summary>
          <ul>{changed.map(k => <li key={k}>{TEXT_DEFAULTS[k].label} <button type="button" className="adm-btn ghost" onClick={() => set(k, DEFAULT_TEXTS[k])}>ברירת מחדל</button></li>)}</ul>
        </details>
      )}
      {fields.length > 0 && <TextsForm initial={t} keys={fields} hint="טקסטים שאין להם מקום להציג כאן." onChange={set} noSave />}
      <div className="adm-save">
        {errors.length > 0 && <ul className="adm-err">{errors.map(e => <li key={e}>{e}</li>)}</ul>}
        {msg && <p className="adm-ok">{msg}</p>}
        <div className="adm-row"><button type="button" className="adm-btn" disabled={busy || !dirty} onClick={submit}>{busy ? 'שומר...' : 'שמירה'}</button></div>
      </div>
    </>
  );
}
