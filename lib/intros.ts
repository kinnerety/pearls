import type { Place } from './types';
import { CATS, ZONE_NAMES, zoneOf } from './config';

// The automatic intro line of a region or category page, used when Kinneret left the field empty in /admin/intros
const n = (k: number, one: string, many: string) => (k === 1 ? one : `${k} ${many}`);

export function regionIntro(region: string, places: Place[]): string {
  const cats = CATS.filter(c => places.some(p => p.cats[0] === c)).slice(0, 3);
  const what = cats.length ? `: ${cats.join(', ')}${places.length > cats.length ? ' ועוד' : ''}` : '';
  return `${n(places.length, 'פנינה אחת', 'פנינים')} ב${region}${what}`;
}

export function catIntro(cat: string, places: Place[]): string {
  const zones = ZONE_NAMES.filter(z => places.some(p => p.region.some(r => zoneOf(r) === z)));
  const where = zones.length > 1 ? 'בכל הארץ, מהצפון ועד הדרום' : zones.length === 1 ? `ב${zones[0]}` : 'שכדאי להכיר';
  return `${n(places.length, 'פנינה אחת', 'פנינים')} של ${cat} ${where}`;
}
