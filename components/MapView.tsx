'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place } from '@/lib/types';
import { CAT_ILLO } from '@/lib/config';
import { ILLO } from '@/lib/illo';
import { TILE_URL, TILE_ATTR } from '@/lib/geo';
import PlaceCard from './PlaceCard';

// Real map (Leaflet + OpenStreetMap tiles). Gets the same filtered array as the gallery.
// Each marker is the category's illustration on a paper cutout; hovering (tapping on a phone) opens the place's
// card itself as the popup, so the map never shows a different, shorter version of a place.
type Props = { items: Place[]; visible: boolean };

const ISRAEL: [[number, number], [number, number]] = [[29.45, 34.25], [33.35, 35.9]];
const STAR = 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z';
const SIZE = 36;

function iconHtml(p: Place) {
  const k = CAT_ILLO[p.cats[0]] || 'valley';
  return `<span class="mk"><svg class="illo" viewBox="0 0 64 64" aria-hidden="true">${ILLO[k] || ''}</svg>` +
    (p.pick ? `<i class="pk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg></i>` : '') + '</span>';
}

// marker size follows the zoom: small in the overview (the Galilee is crowded), full size once you zoom in
const zoomClass = (z: number) => (z <= 8 ? 's' : z <= 9 ? 'm' : 'l');

export default function MapView({ items, visible }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const lib = useRef<typeof L | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const popup = useRef<L.Popup | null>(null);
  const popEl = useRef<HTMLDivElement | null>(null);
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sticky = useRef(false);
  const stickyPan = useRef(false);
  const openId = useRef<number | null>(null);
  const ready = useRef<Promise<void> | null>(null);
  const fit = useRef<(animate: boolean) => void>(() => {});
  const [open, setOpen] = useState<Place | null>(null);

  useEffect(() => {
    let dead = false;
    ready.current = import('leaflet').then(mod => {
      if (dead || !box.current) return;
      const Lf = (mod as unknown as { default?: typeof L }).default || (mod as unknown as typeof L);
      lib.current = Lf;
      const m = Lf.map(box.current, { zoomSnap: 0.25, scrollWheelZoom: false, attributionControl: true });
      m.fitBounds(ISRAEL);
      Lf.tileLayer(TILE_URL, { maxZoom: 18, attribution: TILE_ATTR }).addTo(m);
      m.attributionControl.setPrefix(false);
      layer.current = Lf.layerGroup().addTo(m);
      box.current.dataset.z = zoomClass(m.getZoom());
      m.on('zoomend', () => { if (box.current) box.current.dataset.z = zoomClass(m.getZoom()); });

      // one popup, whose content is a div that React fills with the card
      const el = document.createElement('div');
      el.className = 'cardpop-body';
      el.addEventListener('mouseenter', () => clearTimeout(closeT.current));
      el.addEventListener('mouseleave', () => { if (!sticky.current) closeT.current = setTimeout(() => m.closePopup(), 250); });
      popEl.current = el;
      popup.current = Lf.popup({ className: 'cardpop', maxWidth: 330, minWidth: 200, offset: [0, -14], autoPan: false, closeButton: true }).setContent(el);
      m.on('popupclose', () => { sticky.current = false; openId.current = null; setOpen(null); });
      map.current = m;
    });
    return () => { dead = true; map.current?.remove(); map.current = null; };
  }, []);

  // markers + zoom follow the filtered list
  useEffect(() => {
    ready.current?.then(() => {
      const Lf = lib.current, m = map.current, g = layer.current, pop = popup.current;
      if (!Lf || !m || !g || !pop) return;
      m.closePopup();
      g.clearLayers();
      const pts = items.filter(p => p.lat != null);
      const show = (p: Place, mk: L.Marker, stick: boolean) => {
        clearTimeout(closeT.current);
        if (openId.current === p.id) { if (stick) sticky.current = true; return; }
        if (sticky.current && !stick) return; // a clicked card stays until it is closed or another is clicked
        sticky.current = stick;
        openId.current = p.id;
        stickyPan.current = stick;
        setOpen(p);
        pop.setLatLng(mk.getLatLng());
        if (!pop.isOpen()) m.openPopup(pop);
      };
      const hide = () => { if (!sticky.current) closeT.current = setTimeout(() => m.closePopup(), 250); };
      // picks last so they sit on top
      for (const p of [...pts].sort((a, b) => +a.pick - +b.pick)) {
        const mk = Lf.marker([p.lat!, p.lng!], {
          icon: Lf.divIcon({ html: iconHtml(p), className: 'mk-wrap', iconSize: [SIZE, SIZE], iconAnchor: [SIZE / 2, SIZE / 2] }),
          keyboard: true, title: p.name, riseOnHover: true,
        })
          .on('mouseover', () => show(p, mk, false))
          .on('mouseout', hide)
          .on('click', () => show(p, mk, true))
          .on('keypress', e => { if ((e.originalEvent as KeyboardEvent).key === 'Enter') show(p, mk, true); })
          .addTo(g);
      }
      fit.current = (animate: boolean) => {
        const o = { duration: .6, animate };
        if (pts.length > 1) m.flyToBounds(Lf.latLngBounds(pts.map(p => [p.lat!, p.lng!] as [number, number])), { padding: [30, 30], maxZoom: 13, ...o });
        else if (pts.length === 1) m.flyTo([pts[0].lat!, pts[0].lng!], 12, o);
        else m.flyToBounds(ISRAEL, o);
      };
      // a hidden map (gallery view) has no size: fit once it is shown
      if (box.current && box.current.offsetWidth > 0) fit.current(true);
    });
  }, [items]);

  // the card is rendered into the popup after it opens: tell Leaflet the size changed, then place it where it fits
  useLayoutEffect(() => {
    const m = map.current, pop = popup.current;
    if (!open || !m || !pop) return;
    pop.update();
    const el = pop.getElement(), wrap = el?.querySelector<HTMLElement>('.leaflet-popup-content-wrapper');
    const at = pop.getLatLng();
    if (!el || !wrap || !at) return;
    const PAD = 8, GAP = 34, size = m.getSize(), pt = m.latLngToContainerPoint(at), h = wrap.offsetHeight, w = wrap.offsetWidth;
    // above the marker when there is room, otherwise below it (the CSS does the flipping)
    const below = pt.y - GAP - h < PAD && pt.y + GAP + h <= size.y - PAD;
    el.classList.toggle('below', below);
    el.style.setProperty('--dy', below ? `${h + 2 * GAP}px` : '0px');
    // slide sideways so the card stays inside the map; the tip stays on the marker
    const dx = w > size.x - 2 * PAD ? size.x / 2 - pt.x : Math.max(PAD - (pt.x - w / 2), Math.min(0, size.x - PAD - (pt.x + w / 2)));
    el.style.setProperty('--dx', `${Math.round(dx)}px`);
    // a clicked card that still doesn't fit (small phone map): pan the map just enough
    if (stickyPan.current) {
      const top = below ? pt.y + GAP : pt.y - GAP - h, bottom = top + h;
      const dy = top < PAD ? top - PAD : bottom > size.y - PAD ? bottom - (size.y - PAD) : 0;
      if (dy) m.panBy([0, dy], { animate: true, duration: .35 });
      stickyPan.current = false;
    }
  }, [open]);

  // the map view is hidden behind the gallery: tell Leaflet its size changed when it is shown
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => { map.current?.invalidateSize(); fit.current(false); }, 60);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <>
      <div id="map" ref={box} dir="ltr" role="region" aria-label="מפת המקומות המסוננים" />
      {open && popEl.current && createPortal(<div dir="rtl" className="cardpop-card"><PlaceCard p={open} /></div>, popEl.current)}
    </>
  );
}
