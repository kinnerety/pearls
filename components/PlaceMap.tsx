'use client';
import dynamic from 'next/dynamic';
import type { Place } from '@/lib/types';

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div id="map" /> });

export default function PlaceMap({ p }: { p: Place }) {
  return <MapView items={[p]} visible />;
}
