import type { MetadataRoute } from 'next';
import { SITE_URL, slugOf } from '@/lib/slug';
import { getPlaces } from '@/lib/store';

// The home page plus every place page, so search engines and AI assistants can find each pearl on its own
// (Kinneret, 2026-10-27; the place pages are also linked from the card's name).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const places = await getPlaces();
  return [
    { url: SITE_URL, priority: 1 },
    ...places.map(p => ({ url: `${SITE_URL}/p/${encodeURIComponent(slugOf(p))}`, priority: 0.7 })),
  ];
}
