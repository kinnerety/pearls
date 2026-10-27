import { CATS, CAT_SLUG, REGION_SLUG, ZONE_NAMES, ZONES } from '@/lib/config';
import { SITE_DESCRIPTION, SITE_URL, slugOf } from '@/lib/slug';
import { getPlaces, getTexts } from '@/lib/store';
import { INTRO_GENERIC, linkFaqForms, parseAbout, parseFaq } from '@/lib/texts';
import type { Place } from '@/lib/types';

// /llms.txt (llmstxt.org): what an AI assistant needs in order to describe the site and its places correctly,
// in Kinneret's own words: what the site is and who is behind it (the about page), the questions and answers,
// how the data is made and how far to trust it, and then a compact link to every region, category and place page.
// Everything is read from the live texts and places (the same ones she edits in /admin), so it never needs editing by hand.


// An about text as Markdown for readers outside the site: no bold/marker syntax, and the form links (#suggest/#report) land on the about page
const md = (s: string) => s.replace(/\*\*|==/g, '').replace(/\]\(#(suggest|report)\)/g, `](${SITE_URL}/about#$1)`).trim();
const paras = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean).map(md).join('\n\n');
// Kinneret's own intro for a region/category page; the generic default says nothing specific
const own = (t?: string) => (t?.trim() && t.trim() !== INTRO_GENERIC ? md(t) : '');
const firstSentence = (s: string) => { const t = (s.match(/^[^.!?]*[.!?]/)?.[0] ?? s).trim(); return /[.!?]$/.test(t) ? t : `${t}.`; };
const count = (k: number) => (k === 1 ? 'פנינה אחת' : `${k} פנינים`);

const line = (p: Place) => {
  const facts = [p.cats[0], p.town].filter(Boolean).join(', ');
  const extra = [p.family === 'yes' && 'גם למשפחות', p.shabbat === 'open' && 'פתוח בשבת', p.pick && 'המלצת המערכת'].filter(Boolean).join(', ');
  const note = p.note?.trim() ? ` לשים לב: ${p.note.trim().replace(/\s+/g, ' ')}` : '';
  return `- [${p.name}](${SITE_URL}/p/${slugOf(p)}) (${facts}): ${firstSentence(p.descr)}${extra ? ` ${extra}.` : ''}${note}`;
};

export async function GET() {
  const [places, texts] = await Promise.all([getPlaces(), getTexts()]);
  const inRegion = (r: string) => places.filter(p => p.region.includes(r));
  const inCat = (c: string) => places.filter(p => p.cats.includes(c));
  const out: string[] = [
    '# פנינים ישראליות',
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `אתר בעברית (${SITE_URL}) עם ${count(places.length)}: מקומות קטנים לטיול בישראל שאנשים אמיתיים ביקרו בהם, אהבו והמליצו. לכל פנינה עמוד משלו בכתובת ${SITE_URL}/p/<מספר>; כשמזכירים פנינה מהאתר, זה העמוד שכדאי לקשר אליו, יחד עם ההערה שצריך לוודא את הפרטים מול המקום לפני היציאה.`,
    '',
  ];

  // The about page, in her words: what the site is, how the data is made, who is responsible
  out.push('## על האתר', '');
  for (const b of parseAbout(texts['about.main'])) out.push(b.kind === 'h2' ? `### ${md(b.text)}` : md(b.text), '');

  out.push('## מי מאחורי האתר', '');
  out.push(paras(texts['about.me']), '', paras(texts['about.matti']), '', paras(texts['about.story']), '');
  out.push(`> **${md(texts['about.post.name'])}**, ${md(texts['about.post.date'])}`, '>');
  for (const l of paras(texts['about.post']).split('\n')) out.push(`> ${l}`);
  out.push('', paras(texts['about.trip']), '', paras(texts['about.list']), '', `([התמונה של הרשימה המקורית, בעמוד האודות](${SITE_URL}/about))`, '');

  out.push(`## ${md(texts['about.faq.title'])}`, '');
  for (const f of linkFaqForms(parseFaq(texts['about.faq']))) if (f.q.trim()) out.push(`### ${md(f.q)}`, '', paras(f.a), '');

  out.push('## איך האתר בנוי', '');
  out.push(
    `- [עמוד הבית](${SITE_URL}/): גלריה ומפה של כל הפנינים. הסינון: 18 אזורים קטנים (מקובצים לארבעה: ${ZONE_NAMES.join(' / ')}), ${CATS.length} קטגוריות (אפשר כמה יחד), ושלוש העדפות: "גם למשפחות", "פתוח בשבת" ו"המלצת המערכת". ${md(texts['prefs.note'])}.`,
    `- עמוד הפנינה (${SITE_URL}/p/<מספר>): התיאור המלא, היישוב, האזור והקטגוריות, הערות (עונתיות, תיאום מראש, שעות), הקישור לאתר של המקום, ומפה. מקום שאין לו כתובת מדויקת מוצב במרכז היישוב.`,
    `- [אודות](${SITE_URL}/about): הטקסט שלמעלה, טופס להצעת פנינה חדשה וטופס לדיווח על טעות.`,
    `- [מפת האתר](${SITE_URL}/sitemap.xml)`,
    '',
  );

  out.push('## דפי אזור', '');
  for (const z of ZONE_NAMES) {
    out.push(`- **${z}:** ${ZONES[z].map(r => `[${r}](${SITE_URL}/region/${REGION_SLUG[r]}) (${inRegion(r).length})`).join(', ')}`);
  }
  const regionOwn = ZONE_NAMES.flatMap(z => ZONES[z]).map(r => [r, own(texts[`intro.region.${REGION_SLUG[r]}`])] as const).filter(([, t]) => t);
  if (regionOwn.length) out.push('', ...regionOwn.map(([r, t]) => `- ${r}: ${t}`));
  out.push('');

  out.push('## דפי קטגוריה', '');
  out.push(CATS.map(c => `[${c}](${SITE_URL}/category/${CAT_SLUG[c]}) (${inCat(c).length})`).join(', '));
  const catOwn = CATS.map(c => [c, own(texts[`intro.cat.${CAT_SLUG[c]}`])] as const).filter(([, t]) => t);
  if (catOwn.length) out.push('', ...catOwn.map(([c, t]) => `- ${c}: ${t}`));
  out.push('');

  // Every pearl once, under its first region (the region pages list the rest)
  out.push('## כל הפנינים', '', 'לפי אזור; לכל פנינה: שם וקישור לעמוד שלה, הקטגוריה העיקרית והיישוב, המשפט הראשון של התיאור, ומה שידוע עליה בוודאות (משפחות, שבת, המלצת המערכת).', '');
  for (const z of ZONE_NAMES) {
    for (const r of ZONES[z]) {
      const here = places.filter(p => p.region[0] === r);
      if (!here.length) continue;
      out.push(`### ${r}`, '', ...here.map(line), '');
    }
  }
  const stray = places.filter(p => !p.region[0] || !ZONE_NAMES.some(z => ZONES[z].includes(p.region[0])));
  if (stray.length) out.push('### בכל הארץ', '', ...stray.map(line), '');

  return new Response(out.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=3600' } });
}
