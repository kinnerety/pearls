// Renders the share image for each category into public/share/<illo>.jpg.
// Needs Playwright and the site running locally (fonts and .illo colours come from it):
//   npm run build && npx next start -p 3100   then   node scripts/share-images.cjs
// The category -> illustration map must match CAT_ILLO in lib/config.ts.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../lib/illo.ts'), 'utf8');
const ILLO = eval('(' + src.slice(src.indexOf('{', src.indexOf('ILLO'))).replace(/;\s*$/, '') + ')');
const CATS = [
  ['טבע ונוף', 'valley', '#CBEBD5'], ['משהו לאכול', 'bread', '#F2E8CC'], ['יקבים, מבשלות ומזקקות', 'wine', '#FCF0B4'], ['סדנאות', 'apron', '#DDEEF6'],
  ['סיורים ומפגשים', 'finjan', '#E8F2B2'], ['חקלאות', 'tractor', '#FCF0B4'], ['בעלי חיים', 'hedgehog', '#CBEBD5'],
  ['יוצרים וחנויות', 'stand', '#DDEEF6'], ['תרבות', 'tile', '#E8F2B2'], ['עגלות קפה', 'coffee', '#FCF0B4'], ['אתרי אינטרנט', 'almond', '#DDEEF6'],
];
const out = process.argv[2] || path.join(__dirname, '../public/share');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  await p.goto('http://localhost:3100', { waitUntil: 'networkidle' });
  for (const [cat, k, bg] of CATS) {
    await p.evaluate(({ cat, k, bg, svg }) => {
      document.body.style.cssText = 'margin:0;padding:0;background:' + bg;
      document.body.innerHTML = `
      <div id="card" style="position:relative;width:1080px;height:1080px;overflow:hidden;background:${bg};font-family:var(--display);direction:rtl">
        <svg width="1080" height="1080" style="position:absolute;inset:0;opacity:.55"><defs><pattern id="d" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(12)"><circle cx="6" cy="6" r="3" fill="#fff"/><circle cx="19" cy="19" r="3" fill="#fff"/></pattern></defs><rect width="1080" height="1080" fill="url(#d)"/></svg>
        <div style="position:absolute;left:50%;top:440px;width:640px;height:600px;transform:translate(-50%,-50%) rotate(-3deg);background:#FFFFFF;border-radius:46% 54% 50% 50%/52% 46% 54% 48%;box-shadow:0 4px 0 rgba(60,55,30,.08),0 22px 40px -16px rgba(60,55,30,.45)"></div>
        <svg class="illo" viewBox="0 0 64 64" style="position:absolute;left:50%;top:440px;width:430px;height:430px;transform:translate(-50%,-50%)">${svg}</svg>
        <div style="position:absolute;left:0;right:0;top:770px;text-align:center">
          <div style="margin-top:60px;font-weight:900;font-size:92px;line-height:1;color:#22333B">פנינים ישראליות</div>
        </div>
      </div>`;
    }, { cat, k, bg, svg: ILLO[k] });
    await p.waitForTimeout(150);
    await (await p.$('#card')).screenshot({ path: `${out}/${k}.jpg`, type: 'jpeg', quality: 88 });
  }
  await b.close();
})();
