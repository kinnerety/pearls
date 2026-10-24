'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '@/lib/types';

// Schematic paper map from the sketch (kept until the real map lands).
const K = 100, COS = Math.cos(31.5 * Math.PI / 180), LON0 = 34.15, LAT0 = 33.42;
const px = (lon: number, lat: number) => [(lon - LON0) * COS * K, (LAT0 - lat) * K];
export const FULL = [0, 0, (36.0 - LON0) * COS * K, (LAT0 - 29.4) * K];
export const OUTLINE: [number, number][] = [[35.10,33.09],[35.50,33.09],[35.57,33.28],[35.65,33.25],[35.82,33.33],[35.86,33.15],[35.90,32.95],[35.75,32.72],[35.57,32.64],[35.55,32.40],[35.52,32.00],[35.55,31.75],[35.53,31.50],[35.45,31.10],[35.40,30.90],[35.25,30.60],[35.15,30.30],[35.05,30.00],[34.96,29.55],[34.90,29.49],[34.88,29.75],[34.72,30.15],[34.55,30.40],[34.40,30.85],[34.27,31.22],[34.38,31.38],[34.53,31.58],[34.56,31.68],[34.65,31.82],[34.75,32.05],[34.80,32.20],[34.85,32.40],[34.90,32.55],[34.95,32.72],[34.98,32.82],[35.07,32.85],[35.07,32.93],[35.10,33.00]];
const KINNERET: [number, number][] = [[35.53,32.88],[35.60,32.89],[35.65,32.84],[35.64,32.76],[35.60,32.71],[35.57,32.73],[35.52,32.80]];
const DEADSEA: [number, number][] = [[35.40,31.78],[35.53,31.76],[35.55,31.50],[35.50,31.25],[35.43,31.10],[35.38,31.20],[35.39,31.50]];
export const poly = (pts: [number, number][]) => pts.map(p => px(...p).map(v => v.toFixed(1)).join(',')).join(' ');
const CITIES: [string, number, number][] = [['חיפה',34.99,32.79],['תל אביב',34.78,32.08],['ירושלים',35.21,31.77],['באר שבע',34.79,31.25],['אילת',34.95,29.56]];
const star = (x: number, y: number, r: number) => Array.from({ length: 10 }, (_, i) => { const a = Math.PI / 5 * i - Math.PI / 2, q = i % 2 ? r * .45 : r; return (x + q * Math.cos(a)).toFixed(2) + ',' + (y + q * Math.sin(a)).toFixed(2); }).join(' ');

type Props = { items: Place[]; zoom: boolean; activeId: number | null; onPick: (id: number) => void; onHover: (p: Place | null, e?: React.MouseEvent) => void };

export default function SchematicMap({ items, zoom, activeId, onPick, onHover }: Props) {
  const target = useMemo(() => {
    const pts = items.filter(p => p.lat != null).map(p => px(p.lng!, p.lat!));
    if (!pts.length || !zoom) return FULL;
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    let w = Math.max(x1 - x0, 45), h = Math.max(y1 - y0, 70); const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; w *= 1.4; h *= 1.3;
    if (h / w < 1.6) h = w * 1.6; else w = h / 1.6;
    return [cx - w / 2, cy - h / 2, w, h];
  }, [items, zoom]);
  const [vb, setVb] = useState(FULL);
  const vbRef = useRef(FULL);
  useEffect(() => {
    let raf = 0; const from = vbRef.current.slice(), t0 = performance.now();
    const D = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 450;
    const step = (now: number) => { const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3); const v = from.map((x, i) => x + (target[i] - x) * e); vbRef.current = v; setVb(v); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  const s = Math.min(1, Math.max(.45, target[2] / FULL[2] * 1.4));
  // the hovered/active pin is drawn last so it sits on top; picks above plain dots
  const ordered = [...items.filter(p => p.lat != null)].sort((a, b) => (+(a.id === activeId) - +(b.id === activeId)) || (+a.pick - +b.pick));
  return (
    <svg id="map" role="img" aria-label="מפת המקומות המסוננים" viewBox={vb.join(' ')} onMouseLeave={() => onHover(null)}>
      <polygon className="land" points={poly(OUTLINE)} />
      <polygon className="lake" points={poly(KINNERET)} />
      <polygon className="lake" points={poly(DEADSEA)} />
      {CITIES.map(([n, lo, la]) => { const [x, y] = px(lo, la); return <text key={n} x={x + 2} y={y + 1} textAnchor="start">{n}</text>; })}
      <g>
        {ordered.map(p => {
          const [x, y] = px(p.lng!, p.lat!), cx = x + ((p.id * 7) % 5 - 2) * .35, cy = y + ((p.id * 3) % 5 - 2) * .35;
          const cls = 'pin' + (p.pick ? ' pick' : '') + (p.id === activeId ? ' on' : '');
          const ev = { className: cls, 'data-id': p.id, onClick: () => onPick(p.id), onMouseMove: (e: React.MouseEvent) => onHover(p, e) };
          return p.pick ? <polygon key={p.id} points={star(cx, cy, 3.2 * s)} {...ev} /> : <circle key={p.id} cx={cx} cy={cy} r={1.6 * s} {...ev} />;
        })}
      </g>
    </svg>
  );
}
