import { NextResponse } from 'next/server';
import { addDraft, allPlaces, draftExists, listSubmissions, patchPlace, updateDraft } from '@/lib/store';
import { locate } from '@/lib/places-search';
import { checkPlace } from '@/lib/validate';
import type { Place } from '@/lib/types';

// For the daily run that turns visitors' suggestions into drafts (the add-pearl skill, run by a scheduled Claude session).
// Protected by AUTOMATION_TOKEN (Vercel env; the same value sits in the Claude cloud environment, never in chat).
// GET  → the suggestions not yet drafted (without the sender's email)
// GET ?places=1 → every place's name, town and location (for checking locations)
// place.sources: [{ title, url }] = the pages Claude read; shown beside the draft on /admin/drafts/<id>, never saved with the place
// POST { submission_id?, place } → a new pending draft on /admin/drafts
// POST { locate: "name, town" } → Google Maps (Places) candidates for an exact location
// PATCH { draft_id, place } → rewrite a draft that is still pending
// PATCH { place_id, location: { lat, lng, address?, geo_source } } → set an existing place's exact location (nothing else changes)
// PATCH { place_id, link } → set an existing place's "לאתר" link (nothing else changes)
export const dynamic = 'force-dynamic';

function allowed(req: Request) {
  const token = process.env.AUTOMATION_TOKEN;
  return !!token && req.headers.get('authorization') === `Bearer ${token}`;
}

export async function GET(req: Request) {
  if (!allowed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (new URL(req.url).searchParams.has('places')) {
    const places = (await allPlaces()).map(({ id, name, town, region, link, lat, lng, precision, address, geo_source, hidden }) =>
      ({ id, name, town, region, link, lat, lng, precision, address, geo_source, hidden }));
    return NextResponse.json({ places });
  }
  const subs = (await listSubmissions()).filter(s => s.kind === 'suggest' && s.status === 'new');
  return NextResponse.json({ suggestions: subs.map(({ id, data, created_at }) => { const { email, ...rest } = data; return { id, created_at, ...rest }; }) });
}

export async function POST(req: Request) {
  if (!allowed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { submission_id?: number; place?: Place; locate?: string } | null;
  if (body?.locate) {
    try { return NextResponse.json({ candidates: await locate(body.locate) }); }
    catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 502 }); }
  }
  if (!body?.place) return NextResponse.json({ error: 'missing place' }, { status: 400 });
  const errors = checkPlace(body.place);
  if (errors.length) return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
  if (await draftExists(body.place.name)) return NextResponse.json({ error: 'exists', name: body.place.name }, { status: 409 });
  const id = await addDraft(body.place, body.submission_id ?? null);
  return NextResponse.json({ ok: true, draft_id: id });
}

export async function PATCH(req: Request) {
  if (!allowed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { draft_id?: number; place?: Place; place_id?: number; location?: Location; link?: string } | null;
  if (body?.place_id && body.location) return setLocation(body.place_id, body.location);
  if (body?.place_id && body.link) return setLink(body.place_id, body.link);
  if (!body?.draft_id || !body.place) return NextResponse.json({ error: 'missing draft_id or place' }, { status: 400 });
  const errors = checkPlace(body.place);
  if (errors.length) return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
  if (!(await updateDraft(body.draft_id, body.place))) return NextResponse.json({ error: 'not pending', draft_id: body.draft_id }, { status: 404 });
  return NextResponse.json({ ok: true, draft_id: body.draft_id });
}

type Location = { lat: number; lng: number; address?: string; geo_source?: string };

async function setLocation(id: number, loc: Location) {
  const { lat, lng } = loc;
  if (!(lat > 29.4 && lat < 33.4 && lng > 34.2 && lng < 35.95)) return NextResponse.json({ error: 'המיקום מחוץ לישראל' }, { status: 400 });
  try {
    await patchPlace(id, p => ({ ...p, lat, lng, precision: 'exact', approx: false, geo_source: loc.geo_source || 'Google Maps', ...(loc.address ? { address: loc.address } : {}) }));
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 404 }); }
  return NextResponse.json({ ok: true, place_id: id });
}

async function setLink(id: number, link: string) {
  if (!/^https?:\/\/\S+$/.test(link)) return NextResponse.json({ error: 'קישור לא תקין' }, { status: 400 });
  try { await patchPlace(id, p => ({ ...p, link })); }
  catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 404 }); }
  return NextResponse.json({ ok: true, place_id: id });
}
