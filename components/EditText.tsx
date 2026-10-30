'use client';
import { createContext, useContext, useEffect, useRef } from 'react';
import { DEFAULT_TEXTS, type TextKey, type Texts } from '@/lib/texts';
import { useTexts } from './TextsContext';

// In-place editing of the site texts (Kinneret, 30.10.2026): the admin renders the real popup / forms / map tip and
// every text in them becomes editable where it is. Outside the admin `T` is just the text.
type Edit = { texts: Texts; set: (k: TextKey, v: string) => void } | null;
const EditCtx = createContext<Edit>(null);
export const EditProvider = EditCtx.Provider;
export const useEditing = () => useContext(EditCtx) !== null;

/** One site text. `line` = one line of a multi-line text (a list item, an answer). */
export function T({ k, line }: { k: TextKey; line?: number }) {
  const texts = useTexts(), edit = useContext(EditCtx);
  // while editing, the admin page's own (live) copy of the texts wins over whatever the component was given
  const whole = (edit ? edit.texts : texts)[k];
  const value = line === undefined ? whole : (whole.split('\n')[line] ?? '');
  if (!edit) return <>{value}</>;
  const set = (v: string) => {
    if (line === undefined) return edit.set(k, v);
    const lines = whole.split('\n'); lines[line] = v.replace(/\n/g, ' '); edit.set(k, lines.join('\n'));
  };
  const def = line === undefined ? DEFAULT_TEXTS[k] : (DEFAULT_TEXTS[k].split('\n')[line] ?? '');
  return <Editable value={value} changed={value !== def} onChange={set} />;
}

function Editable({ value, changed, onChange }: { value: string; changed: boolean; onChange: (v: string) => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  // the element owns its text while she types; it is only rewritten from outside (e.g. "ברירת מחדל")
  useEffect(() => { const el = ref.current; if (el && el.innerText !== value) el.innerText = value; }, [value]);
  return (
    <span ref={ref} className="edt" data-changed={changed || undefined} contentEditable suppressContentEditableWarning spellCheck={false}
      onInput={e => onChange(e.currentTarget.innerText.replace(/\n$/, ''))} />
  );
}
