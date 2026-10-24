'use client';
import { useEffect, useRef } from 'react';
import type * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Small map for the admin form: click anywhere or drag the pin to set the exact spot.
export default function PinMap({ lat, lng, onMove }: { lat: number | null; lng: number | null; onMove: (lat: number, lng: number) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const pin = useRef<L.Marker | null>(null);
  const lib = useRef<typeof L | null>(null);
  const cb = useRef(onMove); cb.current = onMove;

  useEffect(() => {
    let dead = false;
    import('leaflet').then(mod => {
      if (dead || !box.current) return;
      const Lf = (mod as unknown as { default?: typeof L }).default || (mod as unknown as typeof L);
      lib.current = Lf;
      const m = Lf.map(box.current, { zoomSnap: 0.25 }).fitBounds([[29.45, 34.25], [33.35, 35.9]]);
      Lf.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd', attribution: '&copy; OpenStreetMap &copy; CARTO' }).addTo(m);
      m.on('click', e => cb.current(+e.latlng.lat.toFixed(5), +e.latlng.lng.toFixed(5)));
      map.current = m;
      place(lat, lng, true);
    });
    return () => { dead = true; map.current?.remove(); map.current = null; pin.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function place(la: number | null, ln: number | null, zoom: boolean) {
    const Lf = lib.current, m = map.current;
    if (!Lf || !m || la == null || ln == null) return;
    if (!pin.current) {
      pin.current = Lf.marker([la, ln], { draggable: true, icon: Lf.divIcon({ html: '<span class="mk on"></span>', className: 'mk-wrap', iconSize: [16, 16], iconAnchor: [8, 8] }) }).addTo(m);
      pin.current.on('dragend', () => { const p = pin.current!.getLatLng(); cb.current(+p.lat.toFixed(5), +p.lng.toFixed(5)); });
    } else pin.current.setLatLng([la, ln]);
    if (zoom) m.setView([la, ln], Math.max(m.getZoom(), 14));
  }
  const last = useRef<string>('');
  useEffect(() => {
    const k = `${lat},${lng}`;
    if (k === last.current) return;
    last.current = k;
    place(lat, lng, true);
  }, [lat, lng]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={box} dir="ltr" className="adm-map" />;
}
