import type { Place } from './types';
import { CATS, REGIONS } from './config';

// Same rules as scripts/validate-data.mjs, for places saved from /admin
export function checkPlace(p: Place): string[] {
  const e: string[] = [];
  if (!p.name?.trim()) e.push('חסר שם');
  if (!p.cats?.length) e.push('צריך לבחור לפחות קטגוריה אחת');
  if (!p.region?.length && !p.cats?.includes('אתרי אינטרנט')) e.push('צריך לבחור לפחות אזור אחד');
  for (const r of p.region || []) if (!REGIONS.includes(r)) e.push(`אזור לא מוכר: ${r}`);
  for (const c of p.cats || []) if (!CATS.includes(c)) e.push(`קטגוריה לא מוכרת: ${c}`);
  if (p.lat != null && !(p.lat > 29.4 && p.lat < 33.4 && p.lng! > 34.2 && p.lng! < 35.95)) e.push('המיקום מחוץ לישראל');
  if (p.link && !/^https?:\/\//.test(p.link)) e.push('הקישור צריך להתחיל ב-https://');
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test([p.descr, p.note, p.link].join(' '))) e.push('לא כותבים כתובות אימייל באתר');
  return e;
}
