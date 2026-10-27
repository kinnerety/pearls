'use client';
import { useEffect, useRef } from 'react';

// The card's title row: name, zone pill(s), then town · region.
// Town · region normally takes its own line under the name; when a long name pushes the zone pill
// down a line, it sits to the left of the pill on that line instead (Kinneret, 27.10).
export default function TitleRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const check = () => {
      const h3 = row.querySelector('h3');
      const zone = row.querySelector<HTMLElement>('.zone');
      row.toggleAttribute('data-wrapped', !!(h3 && zone && zone.offsetTop > h3.offsetTop + 4));
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(row);
    return () => ro.disconnect();
  }, []);
  return <div className="trow" ref={ref}>{children}</div>;
}
