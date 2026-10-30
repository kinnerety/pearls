import 'server-only';

// Exact locations from Google Maps (Places API (New), Text Search). Kinneret, 2026-10-30: every pearl is on Google Maps, so every pearl gets its exact spot.
// Server key GOOGLE_PLACES_KEY (Vercel env, Places API (New) only); the map's browser key is limited to the site's pages and cannot search.
export type Candidate = { name: string; address: string; lat: number; lng: number; maps_url: string; types: string[] };

export async function locate(query: string): Promise<Candidate[]> {
  const key = process.env.GOOGLE_PLACES_KEY;
  if (!key) throw new Error('GOOGLE_PLACES_KEY is not set');
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.types',
    },
    // biased to Israel, Hebrew names and addresses, a handful of candidates so a wrong first hit can be spotted
    body: JSON.stringify({ textQuery: query, languageCode: 'he', regionCode: 'IL', pageSize: 5,
      locationBias: { rectangle: { low: { latitude: 29.4, longitude: 34.2 }, high: { latitude: 33.4, longitude: 35.95 } } } }),
    cache: 'no-store',
  });
  const data = await res.json() as { places?: { displayName?: { text: string }; formattedAddress?: string; location: { latitude: number; longitude: number }; googleMapsUri?: string; types?: string[] }[]; error?: { message: string } };
  if (!res.ok) throw new Error(data.error?.message || `Google answered ${res.status}`);
  return (data.places ?? []).map(p => ({
    name: p.displayName?.text ?? '', address: p.formattedAddress ?? '',
    lat: +p.location.latitude.toFixed(6), lng: +p.location.longitude.toFixed(6),
    maps_url: p.googleMapsUri ?? '', types: p.types ?? [],
  }));
}
