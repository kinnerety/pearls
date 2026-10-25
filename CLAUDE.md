# CLAUDE.md — פנינים ישראליות

> **כלל-על (בקשת כנרת, 24.10.2026):** לקובץ הזה יש שני עותקים שחייבים להיות **זהים תמיד**:
> 1. `/mnt/project-files/CLAUDE.md` (התיקייה המשותפת של הפרויקט)
> 2. `CLAUDE.md` בשורש הריפו https://github.com/kinnerety/pearls
>
> **Whoever edits one copy must update the other in the same step** (same content, byte for byte). Verify with `diff` before finishing. Never leave them out of sync.

## מה זה הפרויקט

אתר של פנינות טיול קטנות ומיוחדות בישראל, מהמלצות של חברים, עם עיון וסינון (אזור, סוג, משפחות, שבת) ומפה. **כל פילטר חל גם על המפה.**
- כותרת: **"פנינים ישראליות"**, כותרת משנה: **"מקומות קטנים ומיוחדים מהמלצות של חברים"**.
- שפת האתר: עברית, RTL.

## איך עובדים עם כנרת

- **הכול בעברית.** כל מה שכנרת עשויה לראות (הודעות, דפים, PR שהיא קוראת) — בעברית. אנגלית בלבלה אותה.
- **הודעות קצרות.** היא הולכת לאיבוד בשרשורים ארוכים: עדיף דף/ממשק מסודר אחד על פני דיווחים מפוזרים.
- **עיצוב: שינוי אחד בכל פעם**, להראות לה לפני שממשיכים. (סקיצה 8, שבה הוכנסו הרבה שינויים בבת אחת, נדחתה כולה.)
- היא מעדיפה שרשור נפרד לכל תחום עבודה.
- החלטות מוצר הן שלה; כשמשהו פתוח — שואלים פעם אחת, עם המלצה.

## החלטות מוצר (מחייבות)

- **אזורים:** 18 אזורים קטנים, תמיד גלויים, **לעולם לא ממוזגים ולא מוסתרים**. מקובצים ויזואלית ל-4 "עננים": צפון / מרכז / ירושלים והאזור / דרום, אבל הסינון הוא לפי האזור הקטן. האזורים הקטנים הם לב הזהות של הפרויקט.
- **קטגוריות (11):** טבע ונוף, אוכל ושתייה, יקבים, מבשלות ומזקקות, סדנאות, סיורים ומפגשים, חקלאות, בעלי חיים, יוצרים וחנויות, תרבות, עגלות קפה, אתרי אינטרנט. (שאלה פתוחה: האם עגלות קפה נשארות קטגוריה נפרדת.) "יקבים, מבשלות ומזקקות" הופרדה מ"אוכל ושתייה" ב-25.10.2026 (כנרת): אייקון כוס יין; "אוכל ושתייה" קיבלה אייקון כיכר לחם שחציה פרוס. **אפשר לבחור כמה קטגוריות יחד** (OR). בכתובת ה-URL הרשימות מופרדות ב-`|` (לא פסיק, כי שם הקטגוריה מכיל פסיק).
- **תגיות על הכרטיס — רק עובדות חיוביות וידועות:** "גם למשפחות", "פתוח בשבת". כשלא ידוע או שלילי — לא מציגים כלום. ("סגור בשבת" הוסר מהכרטיס כי אין לו פילטר.) לא כותבים "בתיאום מראש" למקום מסוים; יש הערה כללית באתר לבדוק תמיד.
- **"עוד העדפות" בפאנל הסינון:** רק שלוש: גם למשפחות / פתוח בשבת / המלצת המערכת. מתחת לכותרת משפט קטן (בלי "חשוב:", כנרת 25.10): "יכול להיות שיש עוד פנינים שמתאימות למשפחות או פתוחות בשבת ולא סווגו ככאלה, ולהפך".
- **כותרת פאנל הקטגוריות: "מה יבוא טוב עכשיו"** (לא "מה עושים"). **אפשר לבחור כמה קטגוריות יחד** (כנרת, 25.10.2026 ערב; כמו באזורים: פנינה מתאימה אם היא באחת מהקטגוריות שנבחרו; בכתובת `?cat=א,ב`). הצ'יפ הראשון הוא **"כל הפנינים"** עם אייקון בלוט, נבחר כברירת מחדל, והוא גם הדרך לנקות את סינון הקטגוריה וההעדפות (לא את האזורים). כשנבחר אזור הוא נקרא **"כל הפנינים באזור שבחרת"**, וכשנבחרו כמה: **"כל הפנינים באזורים שבחרת"**.
- **"המלצת המערכת":** מדבקת כוכב + פילטר; נקבעת ידנית על ידי כנרת בלבד (שדה `pick`). המדבקה בצד שמאל של הכרטיס, ליד האייקון. במפה: כוכב צהוב קטן.
- **קישור:** התווית היא **"למקור"** (כפתור צהוב רך, לא דומיננטי, בצד שמאל של הכרטיס). אתר עצמאי של המקום עדיף על פייסבוק/אינסטגרם.
- **מקומות שנסגרו — מוסרים מהאתר**, לא מסומנים "סגור". סטטוס לא מוצג לציבור.
- **מיקום:** ברמת יישוב זה בסדר כרגע; מקום משוער מסומן ביושר ("מיקום משוער").
- **פופאפ** (נפתח כשמדליקים "גם למשפחות" או "פתוח בשבת"; ניתן להשתקה עד הביקור הבא, sessionStorage):
  - כותרת: "לפני שנכנסים לאוטו"
  - טקסט: "חשוב להיכנס לאתר או לפרופיל של המקום ולוודא שהוא באמת מתאים לך. ההמלצות מגיעות מאנשים אמיתיים, אבל הפרטים נאספים על ידי AI"
  - תיבת סימון: "לא להציג לי שוב את ההודעה הזאת עד הפעם הבאה"
  - כפתור: "100%, אבדוק גם בעצמי 👌"
  - איור: מכונית צהובה קטנה עם שתי חברות מגניבות.
- **פרטיות:** עמודות איש קשר/אימייל מהמקור **לעולם לא** עולות לאתר או לריפו.

## עיצוב

- השראה: https://www.snapsound.com/ — מראה קולאז' נייר-גזור, עם אלמנטים ישראליים מאוירים (דוכיפת, שלדג, יעל, ברוש, אלון, חסידות...).
- פלטה: בהירה, נוטה לצהוב ולתכלת, בלי כתום; ירוקים מעט בהירים. בסיס: קרם #F2E8CC, צהוב #FAD771, ליים #D6DE8A, מרווה #98C4A4, כחול-טורקיז #1C4F66, על רקע אוף-וויט. דיו כהה #22333B רק לטקסט וצלליות.
- כל היסטוריית ההחלטות העיצוביות: זיכרון הפרויקט `site-design.md` ו-`/mnt/project-files/site-sketch/README.md`.

## נתונים וקבצים

Technical notes for Claude:
- Site data (source of truth until M5): `/mnt/project-files/data/places_site.json` (121 places). Fields: id, name, town, region[], types[], cats[], link, descr, lat, lng, approx, shabbat (open/closed/unknown), family (yes/no/unknown), status, pick, tags[], hours, note, evidence. `evidence` and `status` never go to the public site.
- Kinneret's manual decisions/edits: `/mnt/project-files/data/kinneret_overrides.json` (applied last by `site-sketch/build_data.py`; status=closed is dropped).
- Approximate town-level coordinates: `/mnt/project-files/data/coords_approx.json` (also `site-sketch/coords_approx.json`).
- Sketch: `/mnt/project-files/site-sketch/` (`template.html`, `build_data.py`, `build_html.py`, `tags.py`, illustration generators). Published sketch artifact: https://claude.ai/artifact/BWaSbHH5UJbJsgrS7i12Cc.
- Kinneret's review/editing interface: https://claude.ai/artifact/4HZCfWYagRPbzpe1BVDcfE (db collections `decisions`, `edits`; merged via `site-sketch/check/merge_edits.py`).
- Build spec: `/mnt/project-files/plan/BUILD_PLAN.md` (§11 = Kinneret's binding answers). Kinneret-facing plan page: https://claude.ai/artifact/PqPpjuiyxBRhAhZWRh3YB2.
- Notion DB was the original source; Kinneret will **not** use Notion going forward.

## Stack ובנייה

- GitHub: https://github.com/kinnerety/pearls · Vercel (personal account, Hobby; Vercel's GitHub app already installed) · Neon added via the Vercel Marketplace integration (not a separate connection; `DATABASE_URL` comes from Vercel).
- Next.js 15 App Router + TypeScript, no Tailwind (port the sketch CSS), `lang="he" dir="rtl"`, filters in URL params, list and map share one filtered array.
- Map: real map with **automatic geocoding**. **Google Maps in Hebrew** (Kinneret, 25.10.2026 evening: OSM tiles showed Arabic labels). `components/MapView.tsx` picks `GoogleMap.tsx` (language=he, region=IL, our own HTML overlays for markers and the card popup, so **no Map ID** is needed; base map softened with JSON styles, POIs/transit hidden) when `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is set at build time, otherwise (or when Google rejects the key, `gm_authFailure`) the old Leaflet + OSM map `LeafletMap.tsx`. Kinneret creates the key herself in Google Cloud (billing on, Maps JavaScript API only, website restrictions `*.vercel.app`, `pninim-il.co.il`, `*.pninim-il.co.il`; 10k map loads/month free, about $7 per extra 1,000; Kinneret is fine with paying, so no daily quota, a budget email alert at most) and puts it in Vercel env (all environments); **never in chat**. A new env var needs a redeploy. Google zooms in whole steps, so the country overview is a bit wider than Leaflet's was. The admin pin map (`components/admin/PinMap.tsx`) is still Leaflet. Keep the same markers (category illustrations on white paper), the same `PlaceCard` popup, filters and `?v=map`. — Kinneret will not drag pins. Town-level places get `precision: "town"` and the card says "מיקום משוער" (Kinneret, 2026-10-25: no special marker). If too few are exact, revisit with her.
- Views (Kinneret, 2026-10-25): **גלריה / מפה** toggle (`?v=map`), no side map. Switching is a **real sideways slide, no fade** (she rejected a fade): both panels share one grid cell in `.content`, the map comes in from the left and pushes the gallery out to the right (`switchView` + `data-slide` in `Explorer.tsx`). The "על המפה" chip is light blue (`.mapbtn`, #BFDDEE). Above the map: underlined link **"איך להשתמש במפה?"** (`components/MapHelp.tsx`, hover opens, click pins; her exact text: Waze note for town-level places, desktop/phone zoom and drag, hover/click, star). Under the map only "המלצת המערכת" with the yellow-circle black-star badge (the old hover hint line was removed). Ctrl/⌘ + wheel over the map zooms only the map, never the page (`GoogleMap.tsx` prevents the page zoom). Map markers = the category illustration on a white paper cutout (star badge = pick), smaller at the overview zoom. Hover (tap on phone) opens the place's **own card** (`PlaceCard` rendered into the Leaflet popup), so card and map popup can never differ. Place pages `/p/...` exist in code but are not linked from the site (she decided they add nothing); sitemap = home only. They serve as the share landing page (`og:image` = category picture from `public/share/`, absolute on the current deployment host via `SITE_URL` in `lib/slug.ts`). Share text (`lib/share.ts`, Kinneret 2026-10-25 evening): "מעניין אותי לבדוק את '[שם]'. בקצרה: [first sentence] (באזור [אזור]). / לכל הפרטים: [link] / מתוך האתר 'פנינים ישראליות': [place-page link]". **No Waze link** (locations are often town-level and a wrong pin disappoints). The share button sends text only (native share sheet on phones, clipboard on desktop; the site sends nothing, no paid service). **Open item for the END of the project:** the picture in the WhatsApp preview. Findings so far: Vercel Authentication is off (needed for previews); on desktop WhatsApp previewed the picture only when the link was the message's first line, which Kinneret rejected (left-aligned, bare link first). A map popup near the top edge opens below the marker, near a side edge it slides inward (`MapView` sets `below`/`--dx`/`--dy`). `cats[0]` is the place's main category (its icon); the admin form lets Kinneret pick it.
- Milestones: M0 infra → M1 1:1 port of the sketch → M2 real map + geocoding → M3 place pages / sharing / SEO → M4 go-live → M5 Neon + `/admin` (full "add place"; replaces the review artifact). **Each milestone = a PR with a Vercel Preview that Kinneret approves before merge.**
- Repo layout (built 2026-10-24, PR #1): site data `data/places.json` (copied from `places_site.json` by `scripts/import_places.py`, which keeps the repo-owned location fields); `scripts/validate-data.mjs` runs before every build; `lib/filters.ts` = the one filter used by list, map and counts; `lib/store.ts` reads Neon when `DATABASE_URL` is set, otherwise the JSON (an empty Neon table is seeded from the JSON once); `/admin` = password (`ADMIN_PASSWORD`) + signed cookie.
- Geocoding runs in GitHub Actions (`.github/workflows/geocode.yml`, triggered by pushing a change to `scripts/geocode.mjs`), because the Claude container cannot reach Nominatim or the places' websites. It writes `lat/lng/precision/geo_source` into `data/places.json` and a report to `data/geo_report.md`, and commits back to the branch.
- מצב נוכחי (26.10.2026, אחרי חצות): **PR #1 מוזג ל-main** (קומיט 911e28f, כולל PR #2 של גוגל מפות). production ב-Vercel נבנה אוטומטית מ-main ומשרת את https://pninim-il.co.il. ענף העבודה של שרשור הבנייה `claude/project-thread-1gu2j4` הותחל מחדש מ-main (PR שמוזג לא משתמשים בו שוב; כל שינוי חדש = PR חדש). **Neon מחובר** (כנרת, 25.10 בלילה, דרך Vercel Storage: מסד `pearls-db`, Free, אזור iad1; `DATABASE_URL` ועוד משתני POSTGRES_* בסביבות Production ו-Preview). בבקשה הראשונה אחרי החיבור הטבלה `places` מתמלאת מ-`data/places.json`; מאותו רגע **המסד הוא מקור האמת** של האתר ו-`data/places.json` הוא רק הזרע/גיבוי (שינוי בקובץ לא משפיע על האתר כשיש DB). חסר כדי שדף הניהול `/admin` יעבוד: משתנה הסביבה `ADMIN_PASSWORD` ב-Vercel (כנרת מגדירה בעצמה, לעולם לא בצ׳אט) + Redeploy. Vercel Authentication כבויה. פתוח: תמונת השיתוף (לסוף), עגלות קפה כקטגוריה נפרדת.
- Domain: `pninim-il.co.il` (bought by Kinneret 25.10.2026, nameservers at kiwihosting.co.il) is attached to the Vercel project with `www` redirecting to it; DNS set-up belongs to the thread "חיבור הדומיין לאתר". `pninim.co.il` was taken. Vercel's fallback production URL is `pearls-orpin.vercel.app`.

## מי אחראי על מה (שרשורים)

- **"בניית האתר פנינים ישראליות"** — owns the repo code and milestones.
- **"עיצוב האתר"** — owns the sketch (`site-sketch/template.html`) and is the only one that publishes the sketch artifact, **until M1**. After M1 the sketch is frozen; design changes are made in the repo and reviewed via Preview.
- **"מאגר הפנינים: קריאה ובדיקה"** — owns `/mnt/project-files/data/` (place checks, merging Kinneret's marks). Convention: a card marked "סיימתי" with no change = she accepts Claude's recommendation; when she writes "ערכתי", pull her edits into the data.
- Rules for checking places: every link is actually checked (incl. FB/IG); search for the place's own website first. Shabbat only from what is written, else unknown. Families = Kinneret's call.
