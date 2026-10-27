import type { Place } from './types';

// /p/<id>: the number alone (Kinneret, 2026-10-27: a Hebrew name turned into %D7%... when the link was shared).
// Older /p/<id>-<name> links still work: the page reads the number and redirects to the short address.
export const slugOf = (p: Pick<Place, 'id'>) => String(p.id);
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
