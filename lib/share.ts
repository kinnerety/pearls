import type { Place } from './types';
import { wazeUrl } from './geo';
import { slugOf } from './slug';

// Kinneret's wording (2026-10-25). The place's own page comes right after the first line: WhatsApp (and most apps)
// preview the FIRST link in a message, and that page carries the category's picture as its share image.
export function shareText(p: Place, site: string) {
  const what = (p.descr || '').split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, '').trim();
  const area = p.region.length ? ` (באזור ${p.region.join(', ')})` : '';
  const waze = p.cats.includes('אתרי אינטרנט') ? '' : wazeUrl(p);
  return [
    `מעניין אותי לבדוק את '${p.name}'.` + (what ? ` זה ${what}${area}.` : area ? `${area}.` : ''),
    `מתוך האתר 'פנינים ישראליות': ${site}/p/${encodeURIComponent(slugOf(p))}`,
    p.link && `לכל הפרטים: ${p.link}`,
    waze && `לניווט בווייז: ${waze}`,
  ].filter(Boolean).join('\n');
}
