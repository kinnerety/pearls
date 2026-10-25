import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/slug';

// Launch with the home page only; the /p place pages are kept in the code for later but not advertised.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, priority: 1 }];
}
