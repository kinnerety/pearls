import type { Place } from './types';

// /p/<id>-<name>: the id is the stable key, the name is only there to make the link readable
export const slugOf = (p: Pick<Place, 'id' | 'name'>) =>
  `${p.id}-${p.name.replace(/["'`׳״.,:;!?()[\]{}|/\\]+/g, ' ').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60).replace(/-$/, '')}`;
export const idOfSlug = (slug: string) => parseInt(decodeURIComponent(slug), 10);

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://pearls.vercel.app');
