import 'server-only';
import { neon } from '@neondatabase/serverless';
import { unstable_cache, revalidatePath, revalidateTag } from 'next/cache';
import seed from '@/data/places.json';
import type { Place } from './types';
import { canonTags } from './tags';
import { DEFAULT_TEXTS, TEXT_DEFAULTS, type Texts } from './texts';

// Where the places live. Phase A (no DATABASE_URL): data/places.json from the repo.
// Phase B: Neon Postgres (added through the Vercel integration), edited in /admin. The JSON file seeds an empty table once.
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = url ? neon(url) : null;
export const hasDb = !!sql;

export type StoredPlace = Place & { hidden?: boolean; updated_at?: string };

let ready: Promise<void> | null = null;
function ensure() {
  if (!sql) return Promise.resolve();
  return (ready ??= (async () => {
    await sql`create table if not exists places (id integer primary key, data jsonb not null, hidden boolean not null default false, updated_at timestamptz not null default now())`;
    await sql`create table if not exists site_texts (key text primary key, value text not null, updated_at timestamptz not null default now())`;
    await sql`create table if not exists submissions (id serial primary key, kind text not null, data jsonb not null, status text not null default 'new', ip text, created_at timestamptz not null default now())`;
    await sql`create table if not exists drafts (id serial primary key, data jsonb not null, submission_id integer, status text not null default 'pending', created_at timestamptz not null default now(), decided_at timestamptz)`;
    await sql`create table if not exists edits_log (id serial primary key, place_id integer not null, at timestamptz not null default now(), action text not null, before jsonb, after jsonb)`;
    // category renamed "אוכל ושתייה" → "משהו לאכול" (Kinneret, 2026-10-27); a no-op once every row carries the new name
    await sql`update places set data = replace(data::text, '"אוכל ושתייה"', '"משהו לאכול"')::jsonb where data::text like '%"אוכל ושתייה"%'`;
    // region renamed "גולן" → "רמת הגולן" (Kinneret, 2026-10-27)
    await sql`update places set data = replace(data::text, '"גולן"', '"רמת הגולן"')::jsonb where data::text like '%"גולן"%'`;
    // the yellow strip never ends with a period, and its sentences are joined with commas (Kinneret, 2026-10-30); a no-op once clean
    await sql`update places set data = jsonb_set(data, '{note}', to_jsonb(regexp_replace(regexp_replace(data->>'note', '\\.\\s+', ', ', 'g'), '[.\\s]+$', ''))) where data->>'note' ~ '\\.'`;
    await sql`update drafts set data = jsonb_set(data, '{note}', to_jsonb(regexp_replace(regexp_replace(data->>'note', '\\.\\s+', ', ', 'g'), '[.\\s]+$', ''))) where status = 'pending' and data->>'note' ~ '\\.'`;
    const [{ n }] = await sql`select count(*)::int as n from places` as { n: number }[];
    if (n === 0) {
      for (const p of seed as Place[]) await sql`insert into places (id, data) values (${p.id}, ${JSON.stringify(p)}::jsonb) on conflict do nothing`;
    }
    // every place carries its approval date (the launch day for the ones that were there before the field existed)
    await sql`update places set data = data || '{"approved_at":"2026-10-25"}'::jsonb where not (data ? 'approved_at')`;
  })().catch(e => { ready = null; throw e; }));
}

/** The yellow strip: no final period, sentences joined with commas (Kinneret, 2026-10-30). */
export const cleanNote = (note?: string) => note?.trim() ? note.trim().replace(/\.\s+/g, ', ').replace(/[.\s]+$/, '') : undefined;

type Row = { id: number; data: Place; hidden: boolean; updated_at: string };
const fromRow = (r: Row): StoredPlace => ({ ...r.data, id: r.id, hidden: r.hidden, updated_at: r.updated_at });

/** Everything, including hidden places (admin only). */
export async function allPlaces(): Promise<StoredPlace[]> {
  if (!sql) return seed as Place[];
  await ensure();
  return ((await sql`select id, data, hidden, updated_at from places order by id`) as Row[]).map(fromRow);
}

/** What the public site shows. Cached until an admin save calls revalidateTag('places'). */
export const getPlaces = unstable_cache(async (): Promise<Place[]> => {
  const all = await allPlaces();
  return all.filter(p => !p.hidden).map(({ hidden, updated_at, checked, ...p }) => p);
}, ['places-v4'], { tags: ['places'] });

export async function getPlace(id: number) {
  return (await getPlaces()).find(p => p.id === id);
}

function refresh() {
  revalidateTag('places');
  revalidatePath('/', 'layout');
}

export async function savePlace(p: Place, hidden: boolean): Promise<number> {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  // the sources Claude read stay with the draft; a place never stores them
  const { sources: _s, ...rest } = p as Place & { sources?: unknown };
  const clean: Place = { ...rest, note: cleanNote(p.note), ctags: canonTags(p.tags) };
  let id = clean.id;
  if (!id) {
    clean.approved_at ||= new Date().toISOString().slice(0, 10);
    const [{ next }] = await sql`select coalesce(max(id), 0) + 1 as next from places` as { next: number }[];
    id = clean.id = next;
    await sql`insert into places (id, data, hidden) values (${id}, ${JSON.stringify(clean)}::jsonb, ${hidden})`;
    await sql`insert into edits_log (place_id, action, after) values (${id}, 'add', ${JSON.stringify(clean)}::jsonb)`;
  } else {
    const before = await sql`select data, hidden from places where id = ${id}`;
    await sql`update places set data = ${JSON.stringify(clean)}::jsonb, hidden = ${hidden}, updated_at = now() where id = ${id}`;
    await sql`insert into edits_log (place_id, action, before, after) values (${id}, 'edit', ${JSON.stringify(before[0] ?? null)}::jsonb, ${JSON.stringify({ data: clean, hidden })}::jsonb)`;
  }
  refresh();
  return id;
}

/** Quick changes from a row of the admin list (pick, main category, checked) without opening the form. */
export async function patchPlace(id: number, change: (p: Place) => Place) {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  const [row] = await sql`select data, hidden from places where id = ${id}` as { data: Place; hidden: boolean }[];
  if (!row) throw new Error('הפנינה לא נמצאה');
  const after = change({ ...row.data, id });
  await sql`update places set data = ${JSON.stringify(after)}::jsonb, updated_at = now() where id = ${id}`;
  await sql`insert into edits_log (place_id, action, before, after) values (${id}, 'quick', ${JSON.stringify(row)}::jsonb, ${JSON.stringify({ data: after, hidden: row.hidden })}::jsonb)`;
  refresh();
}

export async function deletePlace(id: number) {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  const before = await sql`select data, hidden from places where id = ${id}`;
  await sql`delete from places where id = ${id}`;
  await sql`insert into edits_log (place_id, action, before) values (${id}, 'delete', ${JSON.stringify(before[0] ?? null)}::jsonb)`;
  refresh();
}

/** Editable site texts (popup, map tip, notes): the defaults from lib/texts.ts, overridden by what Kinneret saved in /admin/texts. */
// only the saved rows are cached, so a text key added in code always gets its default (an old cached object would lack it)
const savedTexts = unstable_cache(async (): Promise<{ key: string; value: string }[]> => {
  if (!sql) return [];
  await ensure();
  return await sql`select key, value from site_texts` as { key: string; value: string }[];
}, ['texts-rows'], { tags: ['texts'] });

export async function getTexts(): Promise<Texts> {
  const t: Texts = { ...DEFAULT_TEXTS };
  for (const r of await savedTexts()) if (r.key in TEXT_DEFAULTS) t[r.key as keyof Texts] = r.value;
  return t;
}

export async function saveTexts(t: Partial<Texts>) {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  for (const [k, v] of Object.entries(t)) {
    if (!(k in TEXT_DEFAULTS) || typeof v !== 'string') continue;
    await sql`insert into site_texts (key, value) values (${k}, ${v}) on conflict (key) do update set value = excluded.value, updated_at = now()`;
  }
  revalidateTag('texts');
  revalidatePath('/', 'layout');
}

/** What visitors send from the two popup forms: "suggest" (a new pearl) or "report" (a mistake). Admin only. */
export type SubmissionKind = 'suggest' | 'report' | 'contact';
export type SubmissionStatus = 'new' | 'drafted' | 'done';
export type Submission = { id: number; kind: SubmissionKind; data: Record<string, string>; status: SubmissionStatus; created_at: string };

/** Saves a form, unless the same sender (a hash of the address) already sent too many in the last hour. */
export async function addSubmission(kind: SubmissionKind, data: Record<string, string>, ip: string): Promise<boolean> {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  const [{ n }] = await sql`select count(*)::int as n from submissions where ip = ${ip} and created_at > now() - interval '1 hour'` as { n: number }[];
  if (n >= 8) return false;
  await sql`insert into submissions (kind, data, ip) values (${kind}, ${JSON.stringify(data)}::jsonb, ${ip})`;
  return true;
}

export async function listSubmissions(): Promise<Submission[]> {
  if (!sql) return [];
  await ensure();
  return await sql`select id, kind, data, status, created_at from submissions order by created_at desc` as Submission[];
}

export async function setSubmissionStatus(id: number, status: SubmissionStatus) {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  await sql`update submissions set status = ${status} where id = ${id}`;
}

export async function deleteSubmission(id: number) {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  await sql`delete from submissions where id = ${id}`;
}

/** Pearls gathered by Claude (from a link, or from a visitor's suggestion by the daily run) that wait for Kinneret's
 * approval on /admin/drafts. Approving saves a regular place; rejecting keeps the row for the record. */
export type DraftStatus = 'pending' | 'approved' | 'rejected';
export type DraftRow = { id: number; data: Place; submission_id: number | null; status: DraftStatus; created_at: string; decided_at: string | null; place_id?: number };

export async function listDrafts(status?: DraftStatus): Promise<DraftRow[]> {
  if (!sql) return [];
  await ensure();
  const rows = status
    ? await sql`select id, data, submission_id, status, created_at, decided_at from drafts where status = ${status} order by created_at`
    : await sql`select id, data, submission_id, status, created_at, decided_at from drafts order by created_at desc`;
  return rows as DraftRow[];
}

export async function getDraftRow(id: number): Promise<DraftRow | undefined> {
  if (!sql) return undefined;
  await ensure();
  const [row] = await sql`select id, data, submission_id, status, created_at, decided_at from drafts where id = ${id}` as DraftRow[];
  return row;
}

export async function addDraft(place: Place, submissionId: number | null): Promise<number> {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  const clean: Place = { ...place, id: 0, checked: false, note: cleanNote(place.note), ctags: canonTags(place.tags || []) };
  const [{ id }] = await sql`insert into drafts (data, submission_id) values (${JSON.stringify(clean)}::jsonb, ${submissionId}) returning id` as { id: number }[];
  if (submissionId) await sql`update submissions set status = 'drafted' where id = ${submissionId} and status = 'new'`;
  return id;
}

/** Claude rewrote a pending draft (e.g. after Kinneret's notes), so the approval page shows the new version. */
export async function updateDraft(id: number, place: Place): Promise<boolean> {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  const clean: Place = { ...place, id: 0, checked: false, note: cleanNote(place.note), ctags: canonTags(place.tags || []) };
  const rows = await sql`update drafts set data = ${JSON.stringify(clean)}::jsonb where id = ${id} and status = 'pending' returning id`;
  return rows.length > 0;
}

/** A pending draft with the same name as an existing place or another pending draft (so the daily run never doubles). */
export async function draftExists(name: string): Promise<boolean> {
  if (!sql) return false;
  await ensure();
  const n = name.trim();
  const [a] = await sql`select count(*)::int as n from drafts where status = 'pending' and trim(data->>'name') = ${n}` as { n: number }[];
  const [b] = await sql`select count(*)::int as n from places where trim(data->>'name') = ${n}` as { n: number }[];
  return a.n + b.n > 0;
}

/** Kinneret approved (possibly after editing): the draft becomes a real place. */
export async function approveDraft(id: number, place: Place): Promise<number> {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  const row = await getDraftRow(id);
  if (!row) throw new Error('הטיוטה לא נמצאה');
  const placeId = await savePlace({ ...place, id: 0, checked: false }, false);
  await sql`update drafts set status = 'approved', decided_at = now(), data = data || ${JSON.stringify({ place_id: placeId })}::jsonb where id = ${id}`;
  if (row.submission_id) await sql`update submissions set status = 'done' where id = ${row.submission_id}`;
  return placeId;
}

export async function rejectDraft(id: number) {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  const row = await getDraftRow(id);
  if (!row) throw new Error('הטיוטה לא נמצאה');
  await sql`update drafts set status = 'rejected', decided_at = now() where id = ${id}`;
  if (row.submission_id) await sql`update submissions set status = 'done' where id = ${row.submission_id}`;
}
