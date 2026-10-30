'use client';
import { useEffect, useRef, useState } from 'react';
import type { Texts } from '@/lib/texts';
import SideMenu from './SideMenu';

// Phones only (Kinneret, 30.10.2026: "את התפריט תעשה בהמבורגר"): on narrow screens the menu panel under the filters is hidden,
// and a round hamburger button pinned to the top-left corner opens the same four links as a small dropdown sheet.
// Closes on a tap outside, on Escape, and after a link is tapped. Desktop keeps the menu panel (CSS hides this button there).
export default function MobileMenu({ texts }: { texts: Texts }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', key); };
  }, [open]);
  return (
    <div className="burger" ref={box} onClick={e => { if ((e.target as HTMLElement).closest('a')) setOpen(false); }}>
      <button type="button" className="burger-btn" aria-label={open ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={open} aria-controls="burger-nav" onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {open
            ? <path d="M6 6l12 12M18 6L6 18" />
            : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div id="burger-nav" className="burger-sheet" hidden={!open}><SideMenu texts={texts} /></div>
    </div>
  );
}
