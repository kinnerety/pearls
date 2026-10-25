// Runs before every build: broken data should fail the build rather than ship a broken site.
import fs from 'fs';
const places = JSON.parse(fs.readFileSync(new URL('../data/places.json', import.meta.url), 'utf8'));
const cfg = fs.readFileSync(new URL('../lib/config.ts', import.meta.url), 'utf8');
const quoted = s => [...s.matchAll(/'([^']+)'/g)].map(m => m[1]);
const REGIONS = new Set(quoted(cfg.match(/ZONES[^=]*=\s*\{([\s\S]*?)\n\};/)[1]));
const CATS = new Set(quoted(cfg.match(/CATS = \[([^\]]*)\]/)[1]));
const errors = [];
const ids = new Set();
for (const p of places) {
  const where = `#${p.id} ${p.name}`;
  if (!Number.isInteger(p.id) || ids.has(p.id)) errors.push(`${where}: id חסר או כפול`);
  ids.add(p.id);
  if (!p.name?.trim()) errors.push(`${where}: חסר שם`);
  // websites (אתרי אינטרנט) have no physical region
  if (!p.region?.length && !p.cats?.includes('אתרי אינטרנט')) errors.push(`${where}: חסר אזור`);
  for (const r of p.region || []) if (!REGIONS.has(r)) errors.push(`${where}: אזור לא מוכר "${r}"`);
  if (!p.cats?.length) errors.push(`${where}: חסרה קטגוריה`);
  for (const c of p.cats || []) if (!CATS.has(c)) errors.push(`${where}: קטגוריה לא מוכרת "${c}"`);
  if (p.lat != null && !(p.lat > 29.4 && p.lat < 33.4 && p.lng > 34.2 && p.lng < 35.95)) errors.push(`${where}: קואורדינטות מחוץ לישראל`);
  if (!['open', 'closed', 'unknown'].includes(p.shabbat)) errors.push(`${where}: ערך שבת לא תקין`);
  if (!['yes', 'no', 'unknown'].includes(p.family)) errors.push(`${where}: ערך משפחות לא תקין`);
  if ('evidence' in p || 'status' in p) errors.push(`${where}: שדה פנימי (evidence/status) לא אמור להיות באתר`);
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(JSON.stringify(p))) errors.push(`${where}: נראה שיש כתובת אימייל`);
}
if (errors.length) { console.error('נתונים לא תקינים:\n' + errors.join('\n')); process.exit(1); }
console.log(`data ok: ${places.length} places`);
