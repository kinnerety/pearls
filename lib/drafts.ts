import 'server-only';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import type { Place } from './types';
import { canonTags } from './tags';

// Pearls that Claude gathered from a link (the "הוספת פנינה מקישור" skill) and that Kinneret has not approved yet.
// Each is a JSON file in data/drafts/, shown as the real card on /draft/<name> (Vercel Preview of the PR) and added
// to Neon from /admin/drafts with one click. The file name (without .json) is the draft's name in the URL.
const DIR = join(process.cwd(), 'data', 'drafts');
const SAFE = /^[\w-]+$/;

export type Draft = { key: string; place: Place };

export function listDrafts(): Draft[] {
  let files: string[] = [];
  try { files = readdirSync(DIR).filter(f => f.endsWith('.json')); } catch { return []; }
  return files.map(f => getDraft(f.slice(0, -5))).filter((d): d is Draft => !!d);
}

export function getDraft(key: string): Draft | null {
  if (!SAFE.test(key)) return null;
  try {
    const raw = JSON.parse(readFileSync(join(DIR, `${key}.json`), 'utf8')) as Partial<Place>;
    const place: Place = {
      id: 0, name: '', town: '', region: [], types: [], cats: [], link: '', descr: '', lat: null, lng: null, approx: true,
      shabbat: 'unknown', family: 'unknown', pick: false, checked: false, tags: [], ...raw, ctags: canonTags(raw.tags || []),
    };
    return { key, place };
  } catch { return null; }
}
