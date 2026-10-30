'use client';
import { useEffect, useRef, useState } from 'react';
import type { Texts } from '@/lib/texts';
import { T, useEditing } from './EditText';

// The light-blue "נגישות" chip under "עוד העדפות" (Kinneret, 30.10.2026): not a filter. A click (or hover) opens a tooltip that
// explains why the site says nothing about accessibility. The texts are hers to edit in /admin/texts, where the tip shows open.
export default function AccessTip({ texts }: { texts: Texts }) {
  const editing = useEditing();
  const [open, setOpen] = useState(editing);
  const [stuck, setStuck] = useState(editing);
  const box = useRef<HTMLDivElement>(null);
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const paras = texts['access.text'].split('\n').map(s => s.trim()).filter(Boolean);

  // in the admin the tip is always open for editing: no closing on an outside click, Escape or mouse-leave
  useEffect(() => {
    if (!stuck || editing) return;
    const away = (e: Event) => { if (!box.current?.contains(e.target as Node)) { setStuck(false); setOpen(false); } };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setStuck(false); setOpen(false); } };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [stuck, editing]);

  const enter = () => { clearTimeout(closeT.current); setOpen(true); };
  const leave = () => { if (!stuck && !editing) closeT.current = setTimeout(() => setOpen(false), 200); };

  return (
    <div className={'access' + (editing ? ' static' : '')} ref={box} onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className="chip access-chip" aria-expanded={open} aria-controls="access-tip"
        onClick={() => { if (editing) return; const s = !stuck; setStuck(s); setOpen(s); }}><T k="access.chip" /></button>
      {(open || editing) && (
        <div className="maphelp-tip access-tip" id="access-tip" role="tooltip">
          <b className="maphelp-title"><T k="access.title" /></b>
          {paras.map((_, i) => <p key={i}><T k="access.text" line={i} /></p>)}
        </div>
      )}
    </div>
  );
}
