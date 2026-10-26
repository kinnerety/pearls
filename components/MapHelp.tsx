'use client';
import { useEffect, useRef, useState } from 'react';
import { splitLead, type Texts } from '@/lib/texts';

// "How to use the map?" link above the map: hover opens the tip, a click keeps it open (Kinneret's wording)
export default function MapHelp({ texts }: { texts: Texts }) {
  const [lead, rest] = splitLead(texts['maphelp.important']);
  const items = texts['maphelp.items'].split('\n').map(s => s.trim()).filter(Boolean);
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!stuck) return;
    const away = (e: Event) => { if (!box.current?.contains(e.target as Node)) { setStuck(false); setOpen(false); } };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setStuck(false); setOpen(false); } };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [stuck]);

  const enter = () => { clearTimeout(closeT.current); setOpen(true); };
  const leave = () => { if (!stuck) closeT.current = setTimeout(() => setOpen(false), 200); };

  return (
    <div className="maphelp" ref={box} onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className="maphelp-link" aria-expanded={open} aria-controls="maphelp-tip"
        onClick={() => { const s = !stuck; setStuck(s); setOpen(s); }}>{texts['maphelp.link']}</button>
      {open && (
        <div className="maphelp-tip" id="maphelp-tip" role="tooltip">
          <b className="maphelp-title">{texts['maphelp.link']}</b>
          {rest && <p>{lead && <b>{lead}</b>}{lead ? ' ' : ''}{rest}</p>}
          {items.length > 0 && <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>}
        </div>
      )}
    </div>
  );
}
