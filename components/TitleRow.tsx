'use client';
import { useEffect, useRef } from 'react';

// The card's title row: name, zone pill(s), then town · region.
// The zone pill follows the name's last word. Town · region normally takes its own line under them;
// when the pill has to start a new line by itself, town · region sits to its left on that line (Kinneret, 27.10).
export default function TitleRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const check = () => {
      const h3 = row.querySelector('h3');
      const zone = row.querySelector('.zone');
      if (!h3 || !zone) return;
      // always measure in the plain layout: measuring in the wrapped layout (no margin before the pill)
      // let the pill fit back on the name's line, so the attribute flipped on every resize and the cards shook
      row.removeAttribute('data-wrapped');
      // the pill "wrapped" when it starts a line below the name's last line; when it sits at the end
      // of the name (one line or two), town · region keeps its own line under it
      const lines = h3.getClientRects();
      const last = lines[lines.length - 1];
      row.toggleAttribute('data-wrapped', !!last && zone.getBoundingClientRect().top >= last.bottom - 2);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(row);
    return () => ro.disconnect();
  }, []);
  return <div className="trow" ref={ref}>{children}</div>;
}
