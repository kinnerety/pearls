import { NextResponse } from 'next/server';
import { addDraft, draftExists, listSubmissions, updateDraft } from '@/lib/store';
import { checkPlace } from '@/lib/validate';
import type { Place } from '@/lib/types';

// For the daily run that turns visitors' suggestions into drafts (the add-pearl skill, run by a scheduled Claude session).
// Protected by AUTOMATION_TOKEN (Vercel env; the same value sits in the Claude cloud environment, never in chat).
// GET  → the suggestions not yet drafted (without the sender's email)
// POST { submission_id?, place } → a new pending draft on /admin/drafts
// PATCH { draft_id, place } → rewrite a draft that is still pending
export const dynamic = 'force-dynamic';

function allowed(req: Request) {
  const token = process.env.AUTOMATION_TOKEN;
  return !!token && req.headers.get('authorization') === `Bearer ${token}`;
}

export async function GET(req: Request) {
  if (!allowed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const subs = (await listSubmissions()).filter(s => s.kind === 'suggest' && s.status === 'new');
  return NextResponse.json({ suggestions: subs.map(({ id, data, created_at }) => { const { email, ...rest } = data; return { id, created_at, ...rest }; }) });
}

export async function POST(req: Request) {
  if (!allowed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { submission_id?: number; place?: Place } | null;
  if (!body?.place) return NextResponse.json({ error: 'missing place' }, { status: 400 });
  const errors = checkPlace(body.place);
  if (errors.length) return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
  if (await draftExists(body.place.name)) return NextResponse.json({ error: 'exists', name: body.place.name }, { status: 409 });
  const id = await addDraft(body.place, body.submission_id ?? null);
  return NextResponse.json({ ok: true, draft_id: id });
}

export async function PATCH(req: Request) {
  if (!allowed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null) as { draft_id?: number; place?: Place } | null;
  if (!body?.draft_id || !body.place) return NextResponse.json({ error: 'missing draft_id or place' }, { status: 400 });
  const errors = checkPlace(body.place);
  if (errors.length) return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
  if (!(await updateDraft(body.draft_id, body.place))) return NextResponse.json({ error: 'not pending', draft_id: body.draft_id }, { status: 404 });
  return NextResponse.json({ ok: true, draft_id: body.draft_id });
}
