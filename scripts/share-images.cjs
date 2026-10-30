// Renders the link-preview picture (og:image) for every category and every region cloud into public/share/:
//   cat-<CAT_SLUG>.jpg (11)  and  zone-<north|center|jerusalem|south>.jpg (4)
// 1200×630 (the size WhatsApp, Facebook, Telegram and iMessage show as a large preview), JPEG well under WhatsApp's 300 KB limit.
// The picture = the category (or cloud) ICON on a white paper cutout over a coloured, white-dotted background, with the site title in
// Suez One (Kinneret, 30.10.2026: the icon, not the page header; same look as the square share pictures of 25.10, now landscape).
// Everything sits in the CENTRAL SQUARE (x 285..915): WhatsApp Desktop shows every preview as a small square cut from the middle of the picture
// (Kinneret, 30.10.2026 afternoon), so the icon is centred at the top, the title under it in one line and the subtitle in two lines,
// with the same margin under the subtitle as above the white cutout (~45px).
// Fonts come from Google Fonts, so the network must be reachable.   node scripts/share-images.cjs [outDir]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const literal = (src, name) => { const i = src.indexOf(`export const ${name}`); const a = src.indexOf('{', i); const b = src.indexOf('};', a); return new Function('return ' + src.slice(a, b + 1))(); };
const ILLO = literal(read('lib/illo.ts'), 'ILLO');
const cfg = read('lib/config.ts');
const CAT_SLUG = literal(cfg, 'CAT_SLUG'), CAT_ILLO = literal(cfg, 'CAT_ILLO'), ZONE_ILLO = literal(cfg, 'ZONE_ILLO');
// background per category (the palette tints, as in the first share pictures) and per cloud (the cloud's own colour)
const CAT_BG = { 'טבע ונוף': '#CBEBD5', 'משהו לאכול': '#F2E8CC', 'יקבים, מבשלות ומזקקות': '#FCF0B4', 'סדנאות': '#DDEEF6', 'סיורים ומפגשים': '#E8F2B2', 'חקלאות': '#FCF0B4', 'בעלי חיים': '#CBEBD5', 'יוצרים וחנויות': '#DDEEF6', 'תרבות': '#E8F2B2', 'עגלות קפה': '#FCF0B4', 'אתרי אינטרנט': '#DDEEF6' };
const ZONE = { 'צפון': ['north', '#E8F2B2'], 'מרכז': ['center', '#DDEEF6'], 'ירושלים והאזור': ['jerusalem', '#CBEBD5'], 'דרום': ['south', '#FCF0B4'] };

// the finjan (סיורים ומפגשים) in dark blue instead of light blue, for the share picture (Kinneret, 30.10.2026)
const darkFinjan = svg => svg.replaceAll('#1C4F66', '#22333B').replaceAll('#DDEEF6', '#1C4F66');
const jobs = [
  ...Object.entries(CAT_SLUG).map(([cat, slug]) => ({ file: `cat-${slug}.jpg`, svg: cat === 'סיורים ומפגשים' ? darkFinjan(ILLO[CAT_ILLO[cat]]) : ILLO[CAT_ILLO[cat]], bg: CAT_BG[cat], label: cat })),
  ...Object.entries(ZONE).map(([zone, [slug, bg]]) => ({ file: `zone-${slug}.jpg`, svg: ILLO[ZONE_ILLO[zone]], bg, label: zone })),
];
const out = process.argv[2] || path.join(root, 'public/share');
fs.mkdirSync(out, { recursive: true });

// the icon colour classes from app/globals.css (.illo .y etc.), with the palette tokens inlined
const ILLO_CSS = `
:root{--paper:#FAF7EF;--cream:#F2E8CC;--sun:#FCF0B4;--sun-deep:#FAD771;--lime:#E8F2B2;--sage:#CBEBD5;--mist:#DDEEF6;--teal:#1C4F66;--ink:#22333B;--sheet:#FFFFFF}
.illo{display:block;overflow:visible}
.illo .y{fill:var(--sun-deep)}.illo .sy{fill:var(--sun)}.illo .b{fill:var(--mist)}.illo .w{fill:#FFFFFF}.illo .l{fill:var(--lime)}.illo .s{fill:var(--sage)}
.illo .c{fill:var(--sheet)}.illo .n{fill:var(--ink)}.illo .wd{fill:#E6C9A0}.illo .wd2{fill:#D6B27F}.illo .or{fill:var(--sun-deep)}.illo .tb{fill:var(--teal)}
.illo .sq{fill:var(--sage)}.illo .rk{fill:var(--cream)}.illo .pk{fill:var(--teal)}.illo .rk2{fill:#E6C9A0}
.illo .y,.illo .l,.illo .s,.illo .c,.illo .n,.illo .b,.illo .w,.illo .wd,.illo .rk,.illo .tb,.illo g.c>*,.illo g.y>*{filter:drop-shadow(0 1.2px 1px rgba(60,55,30,.3))}
.illo .o{stroke:none}
.illo path.o:not([class*=" "]),.illo path[fill=none]{fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}`;

const page = ({ svg, bg }) => `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Suez+One&family=Assistant:wght@400;600&display=swap" rel="stylesheet">
<style>
html,body{margin:0;padding:0;background:${bg}}
#card{position:relative;width:1200px;height:630px;overflow:hidden;background:${bg}}
.dots{position:absolute;inset:0;opacity:.55}
.blob{position:absolute;left:600px;top:200px;width:330px;height:310px;transform:translate(-50%,-50%) rotate(-3deg);background:#FFFFFF;border-radius:46% 54% 50% 50%/52% 46% 54% 48%;box-shadow:0 4px 0 rgba(60,55,30,.08),0 22px 40px -16px rgba(60,55,30,.45)}
.icon{position:absolute;left:600px;top:200px;width:224px;height:224px;transform:translate(-50%,-50%)}
.title{position:absolute;left:0;right:0;top:368px;text-align:center;color:#22333B}
.title h1{margin:0;font:400 84px/1 'Suez One',serif}
.title p{margin:14px 0 0;font:600 50px/1.2 Assistant,sans-serif;color:rgba(34,51,59,.8)}
${ILLO_CSS}
</style></head><body>
<div id="card">
  <svg class="dots" width="1200" height="630"><defs><pattern id="d" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(12)"><circle cx="6" cy="6" r="3" fill="#fff"/><circle cx="19" cy="19" r="3" fill="#fff"/></pattern></defs><rect width="1200" height="630" fill="url(#d)"/></svg>
  <div class="blob"></div>
  <svg class="illo icon" viewBox="0 0 64 64">${svg}</svg>
  <div class="title"><h1>פנינים ישראליות</h1><p>מקומות קטנים ומיוחדים<br>מהמלצות של חברים</p></div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const j of jobs) {
    if (!j.svg) { console.warn(`!! no icon for ${j.label}`); continue; }
    await p.setContent(page(j), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const file = path.join(out, j.file);
    await (await p.$('#card')).screenshot({ path: file, type: 'jpeg', quality: 86 });
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`${j.file}  ${kb} KB  (${j.label})`);
    if (kb > 290) console.warn(`  !! ${j.file} is over WhatsApp's 300 KB limit`);
  }
  await b.close();
})();
