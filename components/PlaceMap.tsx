'use client';
import dynamic from 'next/dynamic';
import type { Place } from '@/lib/types';
import { isApprox } from '@/lib/geo';

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div id="map" /> });

export default function PlaceMap({ p }: { p: Place }) {
  // closer than the overview map: the street level for an exact spot, the town for an approximate one (Kinneret, 2026-10-26)
  // no card from the marker here: the whole card is right above the map (Kinneret, 31.10.2026)
  return <MapView items={[p]} visible zoom={isApprox(p) ? 13 : 15} card={false} />;
}
