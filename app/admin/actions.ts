'use server';
import { redirect } from 'next/navigation';
import { endSession, passwordOk, requireAdmin, startSession } from '@/lib/auth';
import { approveDraft, deletePlace, deleteSubmission, patchPlace, rejectDraft, savePlace, saveTexts, setSubmissionStatus, type SubmissionStatus } from '@/lib/store';
import { CATS } from '@/lib/config';
import type { Texts } from '@/lib/texts';
import { checkPlace } from '@/lib/validate';
import type { Place } from '@/lib/types';

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

export type GeoHit = { name: string; lat: number; lng: number; kind: string };
// Address / place search for the admin form (OpenStreetMap Nominatim, Israel only)
export async function geocode(q: string): Promise<GeoHit[]> {
  await requireAdmin();
  if (!q.trim()) return [];
  const u = new URL('https://nominatim.openstreetmap.org/search');
  for (const [k, v] of Object.entries({ q, format: 'jsonv2', countrycodes: 'il', 'accept-language': 'he', limit: '6' })) u.searchParams.set(k, v);
  const r = await fetch(u, { headers: { 'User-Agent': 'pninim-israeliot-admin/1.0 (https://github.com/kinnerety/pearls)' }, cache: 'no-store' });
  if (!r.ok) return [];
  const res = await r.json() as { display_name: string; lat: string; lon: string; category?: string; class?: string; type: string }[];
  return res.map(x => ({ name: x.display_name.split(',').slice(0, 3).join(','), lat: +x.lat, lng: +x.lon, kind: (x.category || x.class) === 'place' || (x.category || x.class) === 'boundary' ? 'town' : 'exact' }));
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
