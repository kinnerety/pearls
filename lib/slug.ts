import type { Place } from './types';

// /p/<id>-<name>: the id is the stable key, the name is only there to make the link readable
export const slugOf = (p: Pick<Place, 'id' | 'name'>) =>
  `${p.id}-${p.name.replace(/["'`׳״.,:;!?()[\]{}|/\\]+/g, ' ').trim().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60).replace(/-$/, '')}`;
export const idOfSlug = (slug: string) => parseInt(decodeURIComponent(slug), 10);

// Absolute base for og:image / canonical links. Production uses the production domain (or NEXT_PUBLIC_SITE_URL once
// the custom domain exists); a preview uses its own branch URL, otherwise WhatsApp would look for the share picture
// on the production domain, which may not have it yet.
// (process.env.X must be spelled out each time: Next.js inlines those; a `const env = process.env` alias crashes in the browser)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_ENV === 'production' && process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}`
        : process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://pearls-orpin.vercel.app');
