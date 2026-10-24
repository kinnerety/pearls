import type { MetadataRoute } from 'next';
import { SITE_URL, slugOf } from '@/lib/slug';
import { PLACES } from '@/lib/places';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, priority: 1 }, ...PLACES.map(p => ({ url: `${SITE_URL}/p/${encodeURIComponent(slugOf(p))}`, priority: .7 }))];
}
