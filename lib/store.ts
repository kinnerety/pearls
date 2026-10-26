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
    await sql`create table if not exists edits_log (id serial primary key, place_id integer not null, at timestamptz not null default now(), action text not null, before jsonb, after jsonb)`;
    const [{ n }] = await sql`select count(*)::int as n from places` as { n: number }[];
    if (n === 0) {
      for (const p of seed as Place[]) await sql`insert into places (id, data) values (${p.id}, ${JSON.stringify(p)}::jsonb) on conflict do nothing`;
    }
  })().catch(e => { ready = null; throw e; }));
}

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
  return all.filter(p => !p.hidden).map(({ hidden, updated_at, ...p }) => p);
}, ['places-v1'], { tags: ['places'] });

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
  const clean: Place = { ...p, ctags: canonTags(p.tags) };
  let id = clean.id;
  if (!id) {
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

export async function deletePlace(id: number) {
  if (!sql) throw new Error('אין עדיין מסד נתונים מחובר');
  await ensure();
  const before = await sql`select data, hidden from places where id = ${id}`;
  await sql`delete from places where id = ${id}`;
  await sql`insert into edits_log (place_id, action, before) values (${id}, 'delete', ${JSON.stringify(before[0] ?? null)}::jsonb)`;
  refresh();
}

/** Editable site texts (popup, map tip, notes): the defaults from lib/texts.ts, overridden by what Kinneret saved in /admin/texts. */
export const getTexts = unstable_cache(async (): Promise<Texts> => {
  if (!sql) return DEFAULT_TEXTS;
  await ensure();
  const rows = await sql`select key, value from site_texts` as { key: string; value: string }[];
  const t: Texts = { ...DEFAULT_TEXTS };
  for (const r of rows) if (r.key in TEXT_DEFAULTS) t[r.key as keyof Texts] = r.value;
  return t;
}, ['texts-v1'], { tags: ['texts'] });

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
