'use server';
import { createHash } from 'crypto';
import { headers } from 'next/headers';
import { addSubmission, type SubmissionKind } from '@/lib/store';

// The public popup forms (suggest a pearl / report a mistake). Spam: a hidden field people never fill, a minimum time
// to fill the form, few links, and at most a few sends an hour from the same address (kept only as a hash).
const FIELDS: Record<SubmissionKind, { keys: string[]; required: string[] }> = {
  suggest: {
    keys: ['name', 'what', 'where', 'love', 'shabbat', 'family', 'more', 'credit', 'credit_name', 'email_ok', 'email', 'agree'],
    required: ['name', 'what', 'where', 'agree'],
  },
  report: { keys: ['place', 'place_id', 'what', 'email_ok', 'email'], required: ['what'] },
};

export type SendResult = { ok: true } | { ok: false; error: string };

export async function sendForm(kind: SubmissionKind, raw: Record<string, string>): Promise<SendResult> {
  const f = FIELDS[kind];
  if (!f) return { ok: false, error: 'טופס לא מוכר' };
  // a bot: answer as if all went well, keep nothing
  const quick = Date.now() - Number(raw._t || 0) < 4000;
  if (raw.website || quick) return { ok: true };
  const data: Record<string, string> = {};
  for (const k of f.keys) {
    const v = String(raw[k] ?? '').trim().slice(0, 2000);
    if (v) data[k] = v;
  }
  if (f.required.some(k => !data[k])) return { ok: false, error: 'חסר שדה חובה' };
  if (data.credit !== 'yes') delete data.credit_name;
  if (data.email_ok !== 'yes') delete data.email;
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, error: 'כתובת המייל לא נראית תקינה' };
  if ((Object.values(data).join(' ').match(/https?:\/\//g) || []).length > 3) return { ok: true };
  const h = await headers();
  const ip = createHash('sha256').update('pearls-forms|' + (h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || '')).digest('hex').slice(0, 24);
  try {
    if (!(await addSubmission(kind, data, ip))) return { ok: false, error: 'נשלחו מכאן הרבה טפסים בשעה האחרונה. אפשר לנסות שוב מאוחר יותר' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'משהו השתבש בשליחה. אפשר לנסות שוב בעוד רגע' };
  }
}
