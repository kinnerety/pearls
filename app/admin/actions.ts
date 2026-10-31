'use server';
import { redirect } from 'next/navigation';
import { endSession, passwordOk, requireAdmin, startSession } from '@/lib/auth';
import { approveDraft, deletePlace, deleteSubmission, patchPlace, rejectDraft, savePlace, saveTexts, setSubmissionStatus, type SubmissionStatus } from '@/lib/store';
import { CATS } from '@/lib/config';
import type { Texts } from '@/lib/texts';
import { checkPlace } from '@/lib/validate';
import type { Place } from '@/lib/types';
import { locate } from '@/lib/places-search';

export async function login(_: string | null, form: FormData): Promise<string | null> {
  if (!passwordOk(String(form.get('password') || ''))) return 'הסיסמה לא נכונה';
  await startSession();
  redirect('/admin');
}

export async function logout() {
  await endSession();
  redirect('/admin');
}

export type SaveResult = { ok: true; id: number } | { ok: false; errors: string[] };
export async function save(p: Place, hidden: boolean): Promise<SaveResult> {
  await requireAdmin();
  const errors = checkPlace(p);
  if (errors.length) return { ok: false, errors };
  try { return { ok: true, id: await savePlace(p, hidden) }; }
  catch (e) { return { ok: false, errors: [(e as Error).message] }; }
}

export type QuickPatch = { pick?: boolean; primary?: string };
/** A change from a row of the admin list. A main category the place didn't have yet is added to it. */
export async function quickSave(id: number, q: QuickPatch): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  if (q.primary !== undefined && !CATS.includes(q.primary)) return { ok: false, error: `קטגוריה לא מוכרת: ${q.primary}` };
  try {
    await patchPlace(id, p => ({
      ...p,
      ...(q.pick !== undefined ? { pick: q.pick } : {}),
      ...(q.primary ? { cats: [q.primary, ...p.cats.filter(c => c !== q.primary)] } : {}),
    }));
    return { ok: true };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}

export async function saveSiteTexts(t: Partial<Texts>): Promise<{ ok: true } | { ok: false; errors: string[] }> {
  await requireAdmin();
  try { await saveTexts(t); return { ok: true }; }
  catch (e) { return { ok: false, errors: [(e as Error).message] }; }
}

/** Kinneret approved a draft on /admin/drafts (after editing it or as is): it becomes a regular place. */
export async function acceptDraft(id: number, p: Place): Promise<SaveResult> {
  await requireAdmin();
  const errors = checkPlace(p);
  if (errors.length) return { ok: false, errors };
  try { return { ok: true, id: await approveDraft(id, p) }; }
  catch (e) { return { ok: false, errors: [(e as Error).message] }; }
}

export async function declineDraft(id: number): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  try { await rejectDraft(id); return { ok: true }; }
  catch (e) { return { ok: false, error: (e as Error).message }; }
}

export async function remove(id: number) {
  await requireAdmin();
  await deletePlace(id);
  redirect('/admin/places');
}

export type GeoHit = { name: string; address?: string; lat: number; lng: number; kind: 'town' | 'exact'; url?: string; coords?: true };
const TOWN_TYPES = ['locality', 'sublocality', 'administrative_area_level_1', 'administrative_area_level_2', 'administrative_area_level_3', 'neighborhood'];
// Place / address search for the admin form: Google Maps (Places), the same lookup the daily run uses, so the admin finds
// whatever Google Maps finds (Kinneret, 31.10.2026: "תצפית מנזר מאר סאבא" exists on Google Maps but OpenStreetMap had no such point).
// OpenStreetMap (Nominatim) stays only as the fallback when there is no GOOGLE_PLACES_KEY.
// Typed coordinates ("31.704373, 35.333518", also a Google Maps link with @lat,lng or q=lat,lng) go straight to the map:
// Google's text search rejects them with an error (Kinneret hit it 31.10.2026 and the whole edit page crashed).
const COORDS = /(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/;
function coordsIn(q: string): GeoHit | null {
  const t = q.trim();
  const m = /^-?\d/.test(t) ? t.match(new RegExp(`^${COORDS.source}$`)) : t.match(/[@=]\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (!m) return null;
  const lat = +m[1], lng = +m[2];
  if (!(lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)) return null;
  return { name: `נ"צ ${lat}, ${lng}`, lat, lng, kind: 'exact', coords: true };
}

/** Location search in the admin form. Never throws: a failure comes back as `error`, so the page stays up (31.10.2026). */
export async function geocode(q: string): Promise<{ hits: GeoHit[]; error?: string }> {
  await requireAdmin();
  if (!q.trim()) return { hits: [] };
  const typed = coordsIn(q);
  if (typed) return { hits: [typed] };
  try {
    if (process.env.GOOGLE_PLACES_KEY) {
      const found = await locate(q);
      return { hits: found.map(c => ({ name: c.name, address: c.address || undefined, lat: c.lat, lng: c.lng, url: c.maps_url || undefined,
        kind: c.types.some(t => TOWN_TYPES.includes(t)) ? 'town' : 'exact' })) };
    }
    const u = new URL('https://nominatim.openstreetmap.org/search');
    for (const [k, v] of Object.entries({ q, format: 'jsonv2', countrycodes: 'il', 'accept-language': 'he', limit: '6' })) u.searchParams.set(k, v);
    const r = await fetch(u, { headers: { 'User-Agent': 'pninim-israeliot-admin/1.0 (https://github.com/kinnerety/pearls)' }, cache: 'no-store' });
    if (!r.ok) return { hits: [], error: 'החיפוש לא הצליח כרגע' };
    const res = await r.json() as { display_name: string; lat: string; lon: string; category?: string; class?: string; type: string }[];
    return { hits: res.map(x => ({ name: x.display_name.split(',').slice(0, 3).join(','), lat: +x.lat, lng: +x.lon, kind: (x.category || x.class) === 'place' || (x.category || x.class) === 'boundary' ? 'town' : 'exact' })) };
  } catch (e) {
    console.error('geocode failed', q, e);
    return { hits: [], error: 'החיפוש לא הצליח כרגע, אפשר לנסות שוב, ללחוץ על המפה או להקליד נ"צ (כמו 31.70, 35.33)' };
  }
}

/** A suggestion or a mistake report from the site's forms: marked as handled (or back to new), or deleted */
export async function markSubmission(id: number, status: SubmissionStatus) {
  await requireAdmin();
  await setSubmissionStatus(id, status);
}
export async function removeSubmission(id: number) {
  await requireAdmin();
  await deleteSubmission(id);
}
