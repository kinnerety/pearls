'use client';
import { useEffect, useRef, useState } from 'react';
import { GOOGLE_MAPS_KEY } from '@/lib/geo';
import { ISRAEL, STYLES, loadGoogle } from '@/components/GoogleMap';
import PinMapLeaflet from './PinMapLeaflet';

type Props = { lat: number | null; lng: number | null; onMove: (lat: number, lng: number) => void };

// Small map for the admin form: click anywhere or drag the pin to set the exact spot.
// The same Google map as the site (Hebrew labels, every village on it; Kinneret, 2026-10-30: the free map lacked
// רמת הנדיב); the OpenStreetMap version stays only as the fallback when there is no key or Google refuses it.
export default function PinMap(props: Props) {
  const [failed, setFailed] = useState(false);
  return GOOGLE_MAPS_KEY && !failed ? <PinMapGoogle {...props} onFail={() => setFailed(true)} /> : <PinMapLeaflet {...props} />;
}

function PinMapGoogle({ lat, lng, onMove, onFail }: Props & { onFail: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const pin = useRef<google.maps.Marker | null>(null);
  const cb = useRef(onMove); cb.current = onMove;
  const failRef = useRef(onFail); failRef.current = onFail;
  const last = useRef<string>('');

  function place(la: number | null, ln: number | null) {
    const m = map.current;
    if (!m || la == null || ln == null) return;
    const at = { lat: la, lng: ln };
    if (!pin.current) {
      pin.current = new google.maps.Marker({ map: m, position: at, draggable: true });
      pin.current.addListener('dragend', () => {
        const p = pin.current!.getPosition();
        if (p) cb.current(+p.lat().toFixed(5), +p.lng().toFixed(5));
      });
    } else pin.current.setPosition(at);
    m.setCenter(at);
    m.setZoom(Math.max(m.getZoom() ?? 0, 15));
  }

  useEffect(() => {
    let dead = false;
    const fail = () => { if (!dead) failRef.current(); };
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = fail;
    loadGoogle(GOOGLE_MAPS_KEY).then(async () => {
      const maps = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
      await google.maps.importLibrary('marker');
      if (dead || !box.current) return;
      // with a point the map opens zoomed on it (fitBounds after the fact used to win and show the whole Middle East); without one, all of Israel
      const m = new maps.Map(box.current, {
        styles: STYLES, backgroundColor: '#DDEEF6', clickableIcons: false, gestureHandling: 'greedy',
        mapTypeControl: false, streetViewControl: false, fullscreenControl: false, zoomControl: true, maxZoom: 19,
        ...(lat != null && lng != null ? { center: { lat, lng }, zoom: 15 } : {}),
      });
      if (lat == null || lng == null) m.fitBounds(ISRAEL, 0);
      m.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) cb.current(+e.latLng.lat().toFixed(5), +e.latLng.lng().toFixed(5));
      });
      map.current = m;
      last.current = `${lat},${lng}`;
      place(lat, lng);
    }).catch(fail);
    return () => { dead = true; pin.current?.setMap(null); pin.current = null; map.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const k = `${lat},${lng}`;
    if (k === last.current) return;
    last.current = k;
    place(lat, lng);
  }, [lat, lng]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={box} dir="ltr" className="adm-map" />;
}
