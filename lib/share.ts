import type { Place } from './types';
import { wazeUrl } from './geo';

// Kinneret's wording (2026-10-25). Lines with nothing to say (no link, no region, websites without Waze) are dropped.
export function shareText(p: Place, site: string) {
  const what = (p.descr || '').split(/(?<=[.!?])\s+/)[0].replace(/[.!?]+$/, '').trim();
  const area = p.region.length ? ` (באזור ${p.region.join(', ')})` : '';
  const waze = p.cats.includes('אתרי אינטרנט') ? '' : wazeUrl(p);
  return [
    `מעניין אותי לבדוק את '${p.name}'.` + (what ? ` זה ${what}${area}.` : area ? `${area}.` : ''),
    p.link && `לכל הפרטים: ${p.link}`,
    waze && `לניווט בווייז: ${waze}`,
    `מתוך האתר 'פנינים ישראליות' ${site}`,
  ].filter(Boolean).join('\n');
}
