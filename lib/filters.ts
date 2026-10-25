import type { Place } from './types';
import { ZONES } from './config';

export type FilterState = { regions: string[]; cats: string[]; prefs: string[]; q: string };
export const EMPTY: FilterState = { regions: [], cats: [], prefs: [], q: '' };

const PREF_TEST: Record<string, (p: Place) => boolean> = {
  'למשפחות': p => p.family === 'yes',
  'פתוח בשבת': p => p.shabbat === 'open',
  'המלצת המערכת': p => !!p.pick,
};
export const hasPref = (p: Place, k: string) => (PREF_TEST[k] ? PREF_TEST[k](p) : p.ctags.includes(k));

/** One test for list, map and counts alike, so every filter applies everywhere. `skip` leaves one facet out (for chip counts). */
export function matches(p: Place, st: FilterState, skip?: 'region' | 'cat'): boolean {
  if (skip !== 'region' && st.regions.length && !p.region.some(r => st.regions.includes(r))) return false;
  // several categories = any of them (like regions), Kinneret 2026-10-25
  if (skip !== 'cat' && st.cats.length && !p.cats.some(c => st.cats.includes(c))) return false;
  for (const k of st.prefs) if (!hasPref(p, k)) return false;
  if (st.q) {
    const s = [p.name, p.town || '', p.descr, ...p.types, ...p.tags, ...p.ctags].join(' ').toLowerCase();
    if (!s.includes(st.q.toLowerCase())) return false;
  }
  return true;
}

export const activeCount = (st: FilterState) => st.regions.length + st.cats.length + st.prefs.length + (st.q ? 1 : 0);
export const zonesOf = (p: Place) => Object.keys(ZONES).filter(z => ZONES[z].some(r => p.region.includes(r)));

// Filters live in the URL so a filtered view can be shared: ?region=גולן|ערבה&cat=סדנאות|תרבות&pref=...&q=...
// ('|' and not ',' because a category name can contain a comma: "יקבים, מבשלות ומזקקות")
export function fromSearch(search: string): FilterState {
  const u = new URLSearchParams(search);
  const list = (k: string) => (u.get(k) || '').split('|').map(s => s.trim()).filter(Boolean);
  return { regions: list('region'), cats: list('cat'), prefs: list('pref'), q: u.get('q') || '' };
}
export function toSearch(st: FilterState): string {
  const u = new URLSearchParams();
  if (st.regions.length) u.set('region', st.regions.join('|'));
  if (st.cats.length) u.set('cat', st.cats.join('|'));
  if (st.prefs.length) u.set('pref', st.prefs.join('|'));
  if (st.q) u.set('q', st.q);
  const s = u.toString();
  return s ? '?' + s : '';
}
