import type { Place } from './types';
import { slugOf } from './slug';
import { DEFAULT_TEXTS, type Texts } from './texts';

// Kinneret's wording (2026-10-25; reshaped by her 30.10.2026 afternoon), editable in /admin/texts (share.*). No Waze link: the location is often only
// town-level and a wrong pin disappoints. Shape: "מעניין אותי לבדוק את <שם> (באזור <אזור>): <התיאור המלא>." then our link, then the place's link.
// The name has no quotes, the region sits in brackets right after it, and the WHOLE description follows the colon (not just its first sentence).
// Our own link comes BEFORE the place's link (30.10.2026): WhatsApp, Telegram, Facebook and iMessage build the preview (title + picture)
// from the FIRST link in the message, so with the place's site first the preview was theirs, usually without a picture.
export function shareText(p: Place, site: string, t: Pick<Texts, 'share.open' | 'share.area' | 'share.details' | 'share.site'> = DEFAULT_TEXTS) {
  const descr = (p.descr || '').trim().replace(/\s+/g, ' ');
  const area = p.region.length ? ` (${t['share.area']} ${p.region.join(', ')})` : '';
  // a wording saved before 30.10 may still wrap the name in quotes or end with a full stop: the name is bare and the line goes on with a colon
  const open = t['share.open'].replace(/['"„“”]\{שם\}['"„“”]/g, '{שם}').replaceAll('{שם}', p.name).trim().replace(/[.:]+$/, '');
  const first = descr ? `${open}${area}: ${descr}${/[.!?…]$/.test(descr) ? '' : '.'}` : `${open}${area}.`;
  return [
    first,
    `${t['share.site']} ${site}/p/${encodeURIComponent(slugOf(p))}`,
    p.link && `${t['share.details']} ${p.link}`,
  ].filter(Boolean).join('\n');
}
