import type { Place } from './types';
import { slugOf } from './slug';
import { DEFAULT_TEXTS, type Texts } from './texts';

// Kinneret's wording (2026-10-25), editable in /admin/texts (share.*). No Waze link: the location is often only town-level and a wrong pin disappoints.
// Our own link comes BEFORE the place's link (30.10.2026): WhatsApp, Telegram, Facebook and iMessage build the preview (title + picture)
// from the FIRST link in the message, so with the place's site first the preview was theirs, usually without a picture.
export function shareText(p: Place, site: string, t: Pick<Texts, 'share.open' | 'share.short' | 'share.area' | 'share.details' | 'share.site'> = DEFAULT_TEXTS) {
  const what = (p.descr || '').split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, '').trim();
  const area = p.region.length ? ` (${t['share.area']} ${p.region.join(', ')})` : '';
  const open = t['share.open'].replaceAll('{שם}', p.name).trim();
  return [
    open + (what ? ` ${t['share.short']} ${what}${area}.` : area ? `${area}.` : ''),
    `${t['share.site']} ${site}/p/${encodeURIComponent(slugOf(p))}`,
    p.link && `${t['share.details']} ${p.link}`,
  ].filter(Boolean).join('\n');
}
