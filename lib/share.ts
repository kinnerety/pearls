import type { Place } from './types';
import { wazeUrl } from './geo';

// The text a card shares. Placeholder wording until Kinneret sends hers.
export function shareText(p: Place, site: string) {
  const waze = p.cats.includes('אתרי אינטרנט') ? '' : wazeUrl(p);
  return [
    p.town ? `${p.name} · ${p.town}` : p.name,
    p.link && `למקור: ${p.link}`,
    waze && `ניווט בווייז: ${waze}`,
    `מתוך "פנינים ישראליות": ${site}`,
  ].filter(Boolean).join('\n');
}
