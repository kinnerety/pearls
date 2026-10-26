import type { Place } from './types';
import { slugOf } from './slug';
import { DEFAULT_TEXTS, type Texts } from './texts';

// Kinneret's wording (2026-10-25), editable in /admin/texts (share.*). No Waze link: the location is often only town-level and a wrong pin disappoints.
// The site link is last; the link preview (picture) is an open item for the end of the project (2026-10-25 evening).
export function shareText(p: Place, site: string, t: Pick<Texts, 'share.open' | 'share.short' | 'share.area' | 'share.details' | 'share.site'> = DEFAULT_TEXTS) {
  const what = (p.descr || '').split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, '').trim();
  const area = p.region.length ? ` (${t['share.area']} ${p.region.join(', ')})` : '';
  const open = t['share.open'].replaceAll('{שם}', p.name).trim();
  return [
    open + (what ? ` ${t['share.short']} ${what}${area}.` : area ? `${area}.` : ''),
    p.link && `${t['share.details']} ${p.link}`,
    `${t['share.site']} ${site}/p/${encodeURIComponent(slugOf(p))}`,
  ].filter(Boolean).join('\n');
}
