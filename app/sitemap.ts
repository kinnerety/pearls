import type { MetadataRoute } from 'next';
import { SITE_URL, slugOf } from '@/lib/slug';
import { getPlaces } from '@/lib/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [{ url: SITE_URL, priority: 1 }, ...(await getPlaces()).map(p => ({ url: `${SITE_URL}/p/${encodeURIComponent(slugOf(p))}`, priority: .7 }))];
}
