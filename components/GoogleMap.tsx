'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Place } from '@/lib/types';
import { CAT_ILLO } from '@/lib/config';
import { ILLO } from '@/lib/illo';
import PlaceCard from './PlaceCard';

// Real map (Google Maps, labels in Hebrew). Gets the same filtered array as the gallery.
// Markers and the popup are our own HTML overlays (no Map ID needed): each marker is the category's illustration on a
// paper cutout; hovering (tapping on a phone) opens the place's card itself, so the map never shows a different,
// shorter version of a place.
type Props = { items: Place[]; visible: boolean; zoom?: number; apiKey: string; onFail: () => void };

export const ISRAEL = { south: 29.45, west: 34.25, north: 33.35, east: 35.9 };
const STAR = 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z';
const GAP = 26, PAD = 8;

// a quiet base map in the site's palette; businesses, bus stops and road shields hidden so only our places stand out
export const STYLES: google.maps.MapTypeStyle[] = [
  { stylers: [{ saturation: -30 }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#FAF7EF' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#DDEEF6' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: '#E8F2B2' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
];

function iconHtml(p: Place) {
  const k = CAT_ILLO[p.cats[0]] || 'valley';
  return `<span class="mk"><svg class="illo" viewBox="0 0 64 64" aria-hidden="true">${ILLO[k] || ''}</svg>` +
    (p.pick ? `<i class="pk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg></i>` : '') + '</span>';
}

// marker size follows the zoom: small in the overview (the Galilee is crowded), full size once you zoom in
const zoomClass = (z: number) => (z <= 8 ? 's' : z <= 9 ? 'm' : 'l');

// the script is loaded once per page, in Hebrew and with Israel as the region
let loader: Promise<void> | null = null;
export function loadGoogle(key: string) {
  if (!loader) loader = new Promise((resolve, reject) => {
    (window as unknown as Record<string, unknown>).__pninimMaps = () => resolve();
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&language=he&region=IL&v=weekly&loading=async&callback=__pninimMaps`;
    s.async = true;
    s.onerror = () => { loader = null; s.remove(); reject(new Error('Google Maps did not load')); };
    document.head.appendChild(s);
  });
  return loader;
}

// OverlayView only exists once the script has loaded, so the overlay classes are made then
function overlays(maps: google.maps.MapsLibrary, core: google.maps.CoreLibrary) {
  type Show = (p: Place, at: google.maps.LatLng, stick: boolean) => void;

  class MarkerLayer extends maps.OverlayView {
    root = document.createElement('div');
    pts: { at: google.maps.LatLng; el: HTMLElement }[] = [];
    constructor(private show: Show, private hide: () => void, private keyOpen: (el: HTMLElement) => void) {
      super();
      this.root.className = 'gmk-layer';
      maps.OverlayView.preventMapHitsAndGesturesFrom(this.root);
    }
    setPlaces(items: Place[]) {
      this.root.replaceChildren();
      this.pts = [];
      // picks last so they sit on top
      for (const p of items.filter(p => p.lat != null).sort((a, b) => +a.pick - +b.pick)) {
        const at = new core.LatLng(p.lat!, p.lng!), el = document.createElement('button');
        el.type = 'button';
        el.className = 'gmk';
        el.setAttribute('aria-label', p.name);
        el.innerHTML = iconHtml(p);
        el.addEventListener('mouseenter', () => this.show(p, at, false));
        el.addEventListener('mouseleave', this.hide);
        // Enter/space on a marker (a click with no mouse, detail 0): the card opens and the keyboard moves into it (accessibility, 30.10.2026)
        el.addEventListener('click', e => { this.show(p, at, true); if (e.detail === 0) this.keyOpen(el); });
        this.root.appendChild(el);
        this.pts.push({ at, el });
      }
      this.draw();
    }
    onAdd() { this.getPanes()!.overlayMouseTarget.appendChild(this.root); }
    draw() {
      const pr = this.getProjection();
      if (!pr) return;
      for (const { at, el } of this.pts) {
        const pt = pr.fromLatLngToDivPixel(at)!;
        el.style.left = `${pt.x}px`;
        el.style.top = `${pt.y}px`;
      }
    }
    onRemove() { this.root.remove(); }
  }

  // one popup, whose body is a div that React fills with the card
  class CardPopup extends maps.OverlayView {
    el = document.createElement('div');
    box = document.createElement('div');
    body = document.createElement('div');
    close = document.createElement('button');
    at: google.maps.LatLng | null = null;
    constructor() {
      super();
      this.el.className = 'gpop';
      this.el.style.setProperty('--gap', `${GAP}px`);
      this.el.style.display = 'none';
      this.box.className = 'gpop-box';
      this.box.tabIndex = -1;
      this.box.setAttribute('role', 'dialog');
      this.close.type = 'button';
      this.close.className = 'gpop-x';
      this.close.setAttribute('aria-label', 'סגירה');
      this.close.textContent = '×';
      const tip = document.createElement('i');
      tip.className = 'gpop-tip';
      this.box.append(this.close, this.body);
      this.el.append(tip, this.box);
      maps.OverlayView.preventMapHitsAndGesturesFrom(this.el);
    }
    onAdd() { this.getPanes()!.floatPane.appendChild(this.el); }
    draw() {
      const pr = this.getProjection();
      if (!pr || !this.at) return;
      const pt = pr.fromLatLngToDivPixel(this.at)!;
      this.el.style.left = `${pt.x}px`;
      this.el.style.top = `${pt.y}px`;
    }
    open(at: google.maps.LatLng) { this.at = at; this.el.style.display = ''; this.draw(); }
    shut() { this.at = null; this.el.style.display = 'none'; }
    point() { return this.at ? this.getProjection()?.fromLatLngToContainerPixel(this.at) ?? null : null; }
    onRemove() { this.el.remove(); }
  }

  return { MarkerLayer, CardPopup };
}
type Overlays = ReturnType<typeof overlays>;

export default function GoogleMap({ items, zoom, apiKey, onFail }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const layer = useRef<InstanceType<Overlays['MarkerLayer']> | null>(null);
  const popup = useRef<InstanceType<Overlays['CardPopup']> | null>(null);
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sticky = useRef(false);
  const stickyPan = useRef(false);
  const openId = useRef<number | null>(null);
  const ready = useRef<Promise<void> | null>(null);
  const fit = useRef<() => void>(() => {});
  const unobserve = useRef<() => void>(() => {});
  const failRef = useRef(onFail);
  failRef.current = onFail;
  const [open, setOpen] = useState<Place | null>(null);

  useEffect(() => {
    let dead = false;
    const fail = () => { if (!dead) failRef.current(); };
    // Google calls this when the key is wrong or not allowed on this domain: fall back to the OpenStreetMap map
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = fail;
    ready.current = loadGoogle(apiKey).then(async () => {
      const [maps, core] = await Promise.all([google.maps.importLibrary('maps'), google.maps.importLibrary('core')]) as
        [google.maps.MapsLibrary, google.maps.CoreLibrary];
      if (dead || !box.current) return;
      const { MarkerLayer, CardPopup } = overlays(maps, core);
      // on touch screens Google's camera control (the four arrows) sat right on the card's share button (30.10.2026); people drag anyway
      const touch = matchMedia('(hover:none) and (pointer:coarse)').matches;
      const m = new maps.Map(box.current, {
        styles: STYLES, backgroundColor: '#DDEEF6', clickableIcons: false, gestureHandling: 'cooperative',
        mapTypeControl: false, streetViewControl: false, fullscreenControl: false, zoomControl: true, cameraControl: !touch, maxZoom: 18,
      });
      m.fitBounds(ISRAEL, 0);
      const el = box.current;
      el.dataset.z = zoomClass(m.getZoom() ?? 8);
      m.addListener('zoom_changed', () => { el.dataset.z = zoomClass(m.getZoom() ?? 8); });
      // Ctrl/⌘ + wheel over the map zooms only the map, not the whole page (Google still gets the event)
      const noPageZoom = (e: WheelEvent) => { if (e.ctrlKey || e.metaKey) e.preventDefault(); };
      el.addEventListener('wheel', noPageZoom, { passive: false });

      const pop = new CardPopup();
      // the marker a keyboard user opened the card from: closing the card puts the keyboard back on it
      let back: HTMLElement | null = null;
      const shut = () => {
        clearTimeout(closeT.current); pop.shut(); sticky.current = false; openId.current = null; setOpen(null);
        if (back && pop.el.contains(document.activeElement)) back.focus();
        back = null;
      };
      const keyOpen = (el: HTMLElement) => {
        back = el;
        pop.box.setAttribute('aria-label', el.getAttribute('aria-label') || '');
        setTimeout(() => pop.box.focus({ preventScroll: true }), 60); // after React has put the card in
      };
      pop.el.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); shut(); } });
      pop.el.addEventListener('mouseenter', () => clearTimeout(closeT.current));
      pop.el.addEventListener('mouseleave', () => { if (!sticky.current) closeT.current = setTimeout(shut, 250); });
      pop.close.addEventListener('click', shut);
      m.addListener('click', shut);
      pop.setMap(m);

      const show = (p: Place, at: google.maps.LatLng, stick: boolean) => {
        clearTimeout(closeT.current);
        if (openId.current === p.id) { if (stick) sticky.current = true; return; }
        if (sticky.current && !stick) return; // a clicked card stays until it is closed or another is clicked
        sticky.current = stick;
        openId.current = p.id;
        stickyPan.current = stick;
        pop.open(at);
        setOpen(p);
      };
      const hide = () => { if (!sticky.current) closeT.current = setTimeout(shut, 250); };
      const g = new MarkerLayer(show, hide, keyOpen);
      g.setMap(m);

      // the map view starts hidden behind the gallery: fit once it has a size (a frame later, so Google has seen it too)
      let sized = el.offsetWidth > 0;
      const ro = new ResizeObserver(() => {
        const now = el.offsetWidth > 0;
        if (now && !sized) requestAnimationFrame(() => fit.current());
        sized = now;
      });
      ro.observe(el);
      unobserve.current = () => ro.disconnect();

      map.current = m;
      layer.current = g;
      popup.current = pop;
    }).catch(fail);
    return () => {
      dead = true;
      unobserve.current();
      layer.current?.setMap(null);
      popup.current?.setMap(null);
      map.current = null;
    };
  }, [apiKey]);

  // markers + zoom follow the filtered list
  useEffect(() => {
    ready.current?.then(() => {
      const m = map.current, g = layer.current, pop = popup.current;
      if (!m || !g || !pop) return;
      clearTimeout(closeT.current);
      pop.shut(); sticky.current = false; openId.current = null; setOpen(null);
      g.setPlaces(items);
      const pts = items.filter(p => p.lat != null);
      fit.current = () => {
        if (pts.length > 1) {
          const b = new google.maps.LatLngBounds();
          for (const p of pts) b.extend({ lat: p.lat!, lng: p.lng! });
          m.fitBounds(b, 30);
          google.maps.event.addListenerOnce(m, 'idle', () => { if ((m.getZoom() ?? 0) > 13) m.setZoom(13); });
        } else if (pts.length === 1) { m.setCenter({ lat: pts[0].lat!, lng: pts[0].lng! }); m.setZoom(zoom ?? 12); }
        else m.fitBounds(ISRAEL, 0);
      };
      // a hidden map (gallery view) has no size: fit once it is shown
      if (box.current && box.current.offsetWidth > 0) fit.current();
    });
  }, [items]);

  // the card is rendered into the popup: place it where it fits (above the marker, below it near the top edge,
  // slid inward near the sides; the tip stays on the marker)
  useLayoutEffect(() => {
    const m = map.current, pop = popup.current, b = box.current;
    if (b) b.toggleAttribute('data-open', !!open); // while a card is open on a phone the zoom buttons hide, so they never sit on the card
    if (!open || !m || !pop || !b) return;
    const pt = pop.point();
    if (!pt) return;
    const W = b.offsetWidth, H = b.offsetHeight, h = pop.box.offsetHeight, w = pop.box.offsetWidth;
    const below = pt.y - GAP - h < PAD && pt.y + GAP + h <= H - PAD;
    pop.el.classList.toggle('below', below);
    const dx = w > W - 2 * PAD ? W / 2 - pt.x : Math.max(PAD - (pt.x - w / 2), Math.min(0, W - PAD - (pt.x + w / 2)));
    pop.el.style.setProperty('--dx', `${Math.round(dx)}px`);
    // a clicked card that still doesn't fit (small phone map): pan the map just enough
    if (stickyPan.current) {
      const top = below ? pt.y + GAP : pt.y - GAP - h, bottom = top + h;
      const dy = top < PAD ? top - PAD : bottom > H - PAD ? bottom - (H - PAD) : 0;
      if (dy) m.panBy(0, dy);
      stickyPan.current = false;
    }
  }, [open]);

  return (
    <>
      <div id="map" ref={box} dir="ltr" role="region" aria-label="מפת המקומות המסוננים" />
      {open && popup.current && createPortal(<div dir="rtl" className="cardpop-card"><PlaceCard p={open} /></div>, popup.current.body)}
    </>
  );
}
