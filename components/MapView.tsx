'use client';
import { useEffect, useRef } from 'react';
import type * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place } from '@/lib/types';

// Real map (Leaflet + CARTO Positron tiles). Gets the same filtered array as the list.
// Places located only to their town get a dashed ring and an honest note instead of a navigation link.
type Props = { items: Place[]; activeId: number | null; visible: boolean; onPick: (id: number) => void; onOpenCard: (id: number) => void };

const ISRAEL: [[number, number], [number, number]] = [[29.45, 34.25], [33.35, 35.9]];
const STAR = 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z';
const esc = (s: string) => s.replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]!));
export const isApprox = (p: Place) => (p.precision ? p.precision !== 'exact' : p.approx);

function iconHtml(p: Place, on: boolean) {
  const cls = 'mk' + (p.pick ? ' mk-pick' : '') + (isApprox(p) ? ' mk-town' : '') + (on ? ' on' : '');
  return p.pick ? `<span class="${cls}"><svg viewBox="0 0 24 24"><path d="${STAR}"/></svg></span>` : `<span class="${cls}"></span>`;
}

function popupHtml(p: Place) {
  const nav = !isApprox(p) && p.lat != null ? `<a class="pop-nav" href="https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes" target="_blank" rel="noopener">ניווט</a>` : '';
  return `<div class="pop" dir="rtl"><b class="pop-name">${esc(p.name)}</b><div class="pop-where">${esc(p.town || '')}${p.town ? ' · ' : ''}${esc(p.region.join(', '))}</div>` +
    (isApprox(p) ? '<div class="pop-approx">מיקום משוער, בתוך היישוב. פרטי הגעה מדויקים באתר המקום</div>' : '') +
    `<div class="pop-foot"><button type="button" class="pop-card" data-id="${p.id}">לכרטיס</button>${nav}${p.link ? `<a class="go" href="${esc(p.link)}" target="_blank" rel="noopener">למקור ←</a>` : ''}</div></div>`;
}

export default function MapView({ items, activeId, visible, onPick, onOpenCard }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const lib = useRef<typeof L | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const markers = useRef(new Map<number, { m: L.Marker; p: Place }>());
  const cb = useRef({ onPick, onOpenCard });
  cb.current = { onPick, onOpenCard };
  const activeRef = useRef(activeId);
  activeRef.current = activeId;
  const ready = useRef<Promise<void> | null>(null);
  const fit = useRef<(animate: boolean) => void>(() => {});

  useEffect(() => {
    let dead = false;
    ready.current = import('leaflet').then(mod => {
      if (dead || !box.current) return;
      const Lf = (mod as unknown as { default?: typeof L }).default || (mod as unknown as typeof L);
      lib.current = Lf;
      const m = Lf.map(box.current, { zoomSnap: 0.25, scrollWheelZoom: false, attributionControl: true });
      m.fitBounds(ISRAEL);
      Lf.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18, subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(m);
      m.attributionControl.setPrefix(false);
      layer.current = Lf.layerGroup().addTo(m);
      m.on('popupopen', e => {
        e.popup.getElement()?.querySelector('.pop-card')?.addEventListener('click', ev => cb.current.onOpenCard(+(ev.currentTarget as HTMLElement).dataset.id!));
      });
      map.current = m;
    });
    return () => { dead = true; map.current?.remove(); map.current = null; markers.current.clear(); };
  }, []);

  // markers + zoom follow the filtered list
  useEffect(() => {
    ready.current?.then(() => {
      const Lf = lib.current, m = map.current, g = layer.current;
      if (!Lf || !m || !g) return;
      g.clearLayers(); markers.current.clear();
      const pts = items.filter(p => p.lat != null);
      // approximate ones first so exact pins and picks sit on top
      for (const p of [...pts].sort((a, b) => (+!isApprox(a) - +!isApprox(b)) || (+a.pick - +b.pick))) {
        const size = p.pick ? 22 : 16;
        const mk = Lf.marker([p.lat!, p.lng!], {
          icon: Lf.divIcon({ html: iconHtml(p, p.id === activeRef.current), className: 'mk-wrap', iconSize: [size, size], iconAnchor: [size / 2, size / 2] }),
          keyboard: true, title: p.name, riseOnHover: true,
        }).bindTooltip(esc(p.name + (p.town ? ' · ' + p.town : '')), { direction: 'top', offset: [0, -8] })
          .bindPopup(popupHtml(p), { maxWidth: 260, autoPanPadding: [20, 20] })
          .on('click', () => cb.current.onPick(p.id))
          .addTo(g);
        markers.current.set(p.id, { m: mk, p });
      }
      fit.current = (animate: boolean) => {
        const o = { duration: .6, animate };
        if (pts.length > 1) m.flyToBounds(Lf.latLngBounds(pts.map(p => [p.lat!, p.lng!] as [number, number])), { padding: [30, 30], maxZoom: 13, ...o });
        else if (pts.length === 1) m.flyTo([pts[0].lat!, pts[0].lng!], 12, o);
        else m.flyToBounds(ISRAEL, o);
      };
      // a hidden map (mobile list view) has no size: fit once it is shown
      if (box.current && box.current.offsetWidth > 0) fit.current(true);
    });
  }, [items]);

  useEffect(() => {
    for (const [id, { m, p }] of markers.current) {
      const on = id === activeId;
      m.setIcon(lib.current!.divIcon({ html: iconHtml(p, on), className: 'mk-wrap', iconSize: [p.pick ? 22 : 16, p.pick ? 22 : 16], iconAnchor: [p.pick ? 11 : 8, p.pick ? 11 : 8] }));
      m.setZIndexOffset(on ? 1000 : 0);
    }
  }, [activeId]);

  // the map box animates open / is hidden on mobile: tell Leaflet its size changed
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => { map.current?.invalidateSize(); fit.current(false); }, 550);
    return () => clearTimeout(t);
  }, [visible]);

  return <div id="map" ref={box} dir="ltr" role="region" aria-label="מפת המקומות המסוננים" />;
}
