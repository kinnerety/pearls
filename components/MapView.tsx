'use client';
import { useState } from 'react';
import type { Place } from '@/lib/types';
import { GOOGLE_MAPS_KEY } from '@/lib/geo';
import GoogleMap from './GoogleMap';
import LeafletMap from './LeafletMap';

// Google Maps in Hebrew when the key is set in Vercel (NEXT_PUBLIC_GOOGLE_MAPS_KEY); otherwise, or if Google refuses
// the key, the OpenStreetMap map. Both get the same filtered array and open the same PlaceCard.
type Props = { items: Place[]; visible: boolean };

export default function MapView(props: Props) {
  const [failed, setFailed] = useState(false);
  return GOOGLE_MAPS_KEY && !failed
    ? <GoogleMap {...props} apiKey={GOOGLE_MAPS_KEY} onFail={() => setFailed(true)} />
    : <LeafletMap {...props} />;
}
