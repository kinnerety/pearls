import type { Place } from './types';
import { slugOf } from './slug';

// Kinneret's wording (2026-10-25). No Waze link: the location is often only town-level and a wrong pin disappoints.
// The site link is last; the link preview (picture) is an open item for the end of the project (2026-10-25 evening).
export function shareText(p: Place, site: string) {
  const what = (p.descr || '').split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, '').trim();
  const area = p.region.length ? ` (באזור ${p.region.join(', ')})` : '';
  return [
    `מעניין אותי לבדוק את '${p.name}'.` + (what ? ` בקצרה: ${what}${area}.` : area ? `${area}.` : ''),
    p.link && `לכל הפרטים: ${p.link}`,
    `מתוך האתר 'פנינים ישראליות': ${site}/p/${encodeURIComponent(slugOf(p))}`,
  ].filter(Boolean).join('\n');
}
