import { CATS, CAT_SLUG, REGION_SLUG, ZONE_NAMES, ZONES } from '@/lib/config';
import { catIntro, regionIntro } from '@/lib/intros';
import { SITE_URL, slugOf } from '@/lib/slug';
import { getPlaces, getTexts } from '@/lib/store';
import { INTRO_GENERIC } from '@/lib/texts';
import type { Place } from '@/lib/types';

// /llms.txt: a plain-Markdown guide to the site for AI assistants and search engines (llmstxt.org):
// what the site is, the rules behind its data, and a link to every region, category and place page.
// Built from the live data, so a new place or an edited text shows up here without a deploy.

const DESCRIPTION = 'מקומות קטנים ומיוחדים לטיול בישראל, מהמלצות של חברים: טבע ונוף, חוות, חנויות מיוחדות, יקבים, סדנאות ויוצרים בכל הארץ, עם סינון לפי אזור, משפחות ושבת ועם אפשרות לראות אותם על מפה';

// Kinneret's own intro for a page; the generic default says nothing specific, so AI engines get the automatic summary instead
const own = (t?: string) => (t?.trim() && t.trim() !== INTRO_GENERIC ? t.trim() : '');
const firstSentence = (s: string) => (s.match(/^[^.!?]*[.!?]/)?.[0] ?? s).trim();
const line = (p: Place) => {
  const facts = [p.town, p.region.join(', '), p.cats.join(', ')].filter(Boolean).join(' · ');
  const extra = [p.family === 'yes' && 'גם למשפחות', p.shabbat === 'open' && 'פתוח בשבת', p.pick && 'המלצת המערכת'].filter(Boolean).join(', ');
  return `- [${p.name}](${SITE_URL}/p/${slugOf(p)}): ${facts}. ${firstSentence(p.descr)}${extra ? ` (${extra})` : ''}`;
};

export async function GET() {
  const [places, texts] = await Promise.all([getPlaces(), getTexts()]);
  const out: string[] = [
    '# פנינים ישראליות',
    '',
    `> ${DESCRIPTION}`,
    '',
    `אתר בעברית (${SITE_URL}) עם ${places.length} "פנינים": מקומות קטנים לטיול בישראל שחברים המליצו עליהם. ההמלצות מגיעות מאנשים אמיתיים; הפרטים על כל מקום (שעות, שבת, התאמה למשפחות) נאספו בעזרת AI, ולכן כדאי לוודא באתר או בפרופיל של המקום לפני שיוצאים לדרך. מקומות שנסגרו מוסרים מהאתר. "המלצת המערכת" היא בחירה אישית של בעלת האתר.`,
    '',
    '## דפים ראשיים',
    '',
    `- [עמוד הבית](${SITE_URL}/): גלריה ומפה של כל הפנינים, עם סינון לפי אזור, קטגוריה, "גם למשפחות", "פתוח בשבת" ו"המלצת המערכת"`,
    `- [אודות](${SITE_URL}/about): מי מאחורי האתר, שאלות ותשובות, טופס להצעת פנינה חדשה וטופס לדיווח על טעות`,
    `- [מפת האתר](${SITE_URL}/sitemap.xml)`,
    '',
    '## לפי אזור',
    '',
    `18 אזורים קטנים, מקובצים לארבעה: ${ZONE_NAMES.join(' / ')}.`,
    '',
  ];
  for (const z of ZONE_NAMES) {
    out.push(`### ${z}`, '');
    for (const r of ZONES[z]) {
      const slug = REGION_SLUG[r], here = places.filter(p => p.region.includes(r));
      out.push(`- [פנינים ב${r}](${SITE_URL}/region/${slug}): ${own(texts[`intro.region.${slug}`]) || regionIntro(r, here)}`);
    }
    out.push('');
  }
  out.push('## לפי קטגוריה', '');
  for (const c of CATS) {
    const slug = CAT_SLUG[c], here = places.filter(p => p.cats.includes(c));
    out.push(`- [${c}](${SITE_URL}/category/${slug}): ${own(texts[`intro.cat.${slug}`]) || catIntro(c, here)}`);
  }
  out.push('', '## כל הפנינים', '', 'שורה לכל פנינה: שם, יישוב, אזור, קטגוריות, ותיאור קצר. בעמוד הפנינה יש את התיאור המלא, הקישור לאתר של המקום והמפה.', '');
  for (const p of places) out.push(line(p));
  out.push('');
  return new Response(out.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=3600' } });
}
