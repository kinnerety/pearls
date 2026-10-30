import type { MetadataRoute } from 'next';
import { SITE_URL, slugOf } from '@/lib/slug';
import { getPlaces } from '@/lib/store';
import { CATS, CAT_SLUG, REGIONS, REGION_SLUG } from '@/lib/config';

// The home page plus every place page, so search engines and AI assistants can find each pearl on its own
// (Kinneret, 2026-10-27; the place pages are also linked from the card's name).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const places = await getPlaces();
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/about`, priority: 0.5 },
    { url: `${SITE_URL}/contact`, priority: 0.3 },
    { url: `${SITE_URL}/accessibility`, priority: 0.3 },
    ...REGIONS.map(r => ({ url: `${SITE_URL}/region/${REGION_SLUG[r]}`, priority: 0.8 })),
    ...CATS.map(c => ({ url: `${SITE_URL}/category/${CAT_SLUG[c]}`, priority: 0.8 })),
    ...places.map(p => ({ url: `${SITE_URL}/p/${encodeURIComponent(slugOf(p))}`, priority: 0.7 })),
  ];
}
