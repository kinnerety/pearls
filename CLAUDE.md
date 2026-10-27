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

- **אזורים:** 18 אזורים קטנים (מ-27.10.2026 "גולן" נקרא "רמת הגולן"; שינוי שם אזור = `lib/config.ts`, `data/places.json`, הסבה ב-`ensure()` ומפתח cache חדש), תמיד גלויים, **לעולם לא ממוזגים ולא מוסתרים**. מקובצים ויזואלית ל-4 "עננים": צפון / מרכז / ירושלים והאזור / דרום, אבל הסינון הוא לפי האזור הקטן. האזורים הקטנים הם לב הזהות של הפרויקט.
- **קטגוריות (11):** טבע ונוף, משהו לאכול (עד 27.10.2026 "אוכל ושתייה"; כנרת שינתה את השם, הנתונים ב-Neon הוסבו אוטומטית ב-`ensure()`), יקבים, מבשלות ומזקקות, סדנאות, סיורים ומפגשים, חקלאות, בעלי חיים, יוצרים וחנויות, תרבות, עגלות קפה, אתרי אינטרנט. (שאלה פתוחה: האם עגלות קפה נשארות קטגוריה נפרדת.) "יקבים, מבשלות ומזקקות" הופרדה מ"אוכל ושתייה" ב-25.10.2026 (כנרת): אייקון כוס יין; "אוכל ושתייה" קיבלה אייקון כיכר לחם עם חריצים על קרש (כנרת בחרה 25.10 בלילה מתוך 6 הצעות; הלחם החצי-פרוס לא היה ברור). **אפשר לבחור כמה קטגוריות יחד** (OR). בכתובת ה-URL הרשימות מופרדות ב-`|` (לא פסיק, כי שם הקטגוריה מכיל פסיק).
- **תגיות על הכרטיס — רק עובדות חיוביות וידועות:** "גם למשפחות", "פתוח בשבת". כשלא ידוע או שלילי — לא מציגים כלום. ("סגור בשבת" הוסר מהכרטיס כי אין לו פילטר.) לא כותבים "בתיאום מראש" למקום מסוים; יש הערה כללית באתר לבדוק תמיד.
- **"עוד העדפות" בפאנל הסינון:** רק שלוש: גם למשפחות / פתוח בשבת / המלצת המערכת. מתחת לכותרת משפט קטן (בלי "חשוב:", כנרת 25.10): "יכול להיות שיש עוד פנינים שמתאימות למשפחות או פתוחות בשבת ולא סווגו ככאלה, ולהפך".
- **כותרת פאנל הקטגוריות: "מה יבוא טוב עכשיו"** (לא "מה עושים"). **אפשר לבחור כמה קטגוריות יחד** (כנרת, 25.10.2026 ערב; כמו באזורים: פנינה מתאימה אם היא באחת מהקטגוריות שנבחרו; בכתובת `?cat=א|ב`). הצ'יפ הראשון הוא **"כל הפנינים"** עם אייקון בלוט, נבחר כברירת מחדל, והוא גם הדרך לנקות את סינון הקטגוריה וההעדפות (לא את האזורים). כשנבחר אזור הוא נקרא **"כל הפנינים באזור שבחרת"**, וכשנבחרו כמה: **"כל הפנינים באזורים שבחרת"**.
- **"המלצת המערכת":** מדבקת כוכב + פילטר; נקבעת ידנית על ידי כנרת בלבד (שדה `pick`). המדבקה בצד שמאל של הכרטיס, ליד האייקון. במפה: כוכב צהוב קטן.
- **כרטיס:** כפתור שיתוף תכלת בצד ימין ("שיתוף או / שליחה לעצמי"), כפתור הקישור בצד שמאל. הכרטיס במפה הוא בדיוק אותו כרטיס כמו בגלריה.
- **קישור:** התווית היא **"לאתר"** (כנרת, 26.10.2026 בבוקר; היה "למקור"; כפתור צהוב רך, לא דומיננטי, בצד שמאל של הכרטיס). אתר עצמאי של המקום עדיף על פייסבוק/אינסטגרם.
- **מקומות שנסגרו — מוסרים מהאתר**, לא מסומנים "סגור". סטטוס לא מוצג לציבור.
- **מיקום:** ברמת יישוב זה בסדר כרגע; מקום משוער מסומן ביושר ("מיקום משוער").
- **פופאפ** (נפתח כשמדליקים "גם למשפחות" או "פתוח בשבת"; ניתן להשתקה עד הביקור הבא, sessionStorage). הנוסח למטה הוא ברירת המחדל; כנרת יכולה לשנות אותו ב-`/admin/texts`:
  - כותרת: "לפני שנכנסים לאוטו"
  - טקסט: "חשוב להיכנס לאתר או לפרופיל של המקום ולוודא שהוא באמת מתאים לך. ההמלצות מגיעות מאנשים אמיתיים, אבל הפרטים נאספים על ידי AI"
  - תיבת סימון: "לא להציג לי שוב את ההודעה הזאת עד הפעם הבאה"
  - כפתור: "100%, אבדוק גם בעצמי 👌"
  - איור: מכונית צהובה קטנה עם שתי חברות מגניבות.
- **פרטיות:** עמודות איש קשר/אימייל מהמקור **לעולם לא** עולות לאתר או לריפו.

## עיצוב

- השראה: https://www.snapsound.com/ — מראה קולאז' נייר-גזור, עם אלמנטים ישראליים מאוירים (דוכיפת, שלדג, יעל, ברוש, אלון, חסידות...).
- פלטה: בהירה, נוטה לצהוב ולתכלת, בלי כתום; ירוקים מעט בהירים. בסיס: קרם #F2E8CC, צהוב #FAD771, ליים #D6DE8A, מרווה #98C4A4, כחול-טורקיז #1C4F66, על רקע אוף-וויט. דיו כהה #22333B רק לטקסט וצלליות.
- **הדר (כנרת, 27.10.2026):** מרכז הכותרת "פנינים ישראליות" בגובה המקור של הדוכיפת (31.1% מגובה התמונה, בכל רוחב). העלים הנושרים (`TITLE_LEAVES_SVG` ב-`components/art.ts`, שכבה בתוך `.title`) צפופים יותר מימין ומסודרים מעל הכותרת, מאחוריה ומתחתיה; בטעינת הדף הם נכנסים מימין בתנועה אחת קצרה ונעצרים במקום שבו עצרו באמצע בגרסה הקודמת (כנרת: "המיקום הראשון יותר טוב"). **פאביקון (בחירת כנרת, הצעה א):** בלוט צהוב #FAD771 עם כיפה וגבעול בכחול-טורקיז #1C4F66, על עיגול תכלת (`app/icon.svg`).
- כל היסטוריית ההחלטות העיצוביות: זיכרון הפרויקט `site-design.md` ו-`/mnt/project-files/site-sketch/README.md`.

## נתונים וקבצים

Technical notes for Claude:
- **Source of truth since 25.10.2026 = Neon** (table `places`), edited by Kinneret in https://pninim-il.co.il/admin (she adds new places there). `data/places.json` in the repo is only the seed/backup; `/mnt/project-files/data/places_site.json` is the pre-launch data (121 places) and no longer feeds the site. Fields: id, name, town, region[], types[], cats[], link, descr, lat, lng, approx, shabbat (open/closed/unknown), family (yes/no/unknown), status, pick, tags[], hours, note, evidence. `evidence` and `status` never go to the public site.
- Kinneret's manual decisions/edits: `/mnt/project-files/data/kinneret_overrides.json` (applied last by `site-sketch/build_data.py`; status=closed is dropped).
- Approximate town-level coordinates: `/mnt/project-files/data/coords_approx.json` (also `site-sketch/coords_approx.json`).
- Sketch: `/mnt/project-files/site-sketch/` (`template.html`, `build_data.py`, `build_html.py`, `tags.py`, illustration generators). Published sketch artifact: https://claude.ai/artifact/BWaSbHH5UJbJsgrS7i12Cc.
- Kinneret's old review/editing interface (superseded by `/admin`): https://claude.ai/artifact/4HZCfWYagRPbzpe1BVDcfE (db collections `decisions`, `edits`; merged via `site-sketch/check/merge_edits.py`).
- Build spec: `/mnt/project-files/plan/BUILD_PLAN.md` (§11 = Kinneret's binding answers). Kinneret-facing plan page: https://claude.ai/artifact/PqPpjuiyxBRhAhZWRh3YB2.
- Notion DB was the original source; Kinneret will **not** use Notion going forward.

## Stack ובנייה

- GitHub: https://github.com/kinnerety/pearls · Vercel (personal account, Hobby; Vercel's GitHub app already installed) · Neon added via the Vercel Marketplace integration (not a separate connection; `DATABASE_URL` comes from Vercel).
- Next.js 15 App Router + TypeScript, no Tailwind (port the sketch CSS), `lang="he" dir="rtl"`, filters in URL params, list and map share one filtered array.
- Map: real map with **automatic geocoding**. **Google Maps in Hebrew** (Kinneret, 25.10.2026 evening: OSM tiles showed Arabic labels). `components/MapView.tsx` picks `GoogleMap.tsx` (language=he, region=IL, our own HTML overlays for markers and the card popup, so **no Map ID** is needed; base map softened with JSON styles, POIs/transit hidden) when `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is set at build time, otherwise (or when Google rejects the key, `gm_authFailure`) the old Leaflet + OSM map `LeafletMap.tsx`. Kinneret creates the key herself in Google Cloud (billing on, Maps JavaScript API only, website restrictions `*.vercel.app`, `pninim-il.co.il`, `*.pninim-il.co.il`; 10k map loads/month free, about $7 per extra 1,000; Kinneret is fine with paying, so no daily quota, a budget email alert at most) and puts it in Vercel env (all environments); **never in chat**. A new env var needs a redeploy. Google zooms in whole steps, so the country overview is a bit wider than Leaflet's was. The admin pin map (`components/admin/PinMap.tsx`) is still Leaflet. Keep the same markers (category illustrations on white paper), the same `PlaceCard` popup, filters and `?v=map`. — Kinneret will not drag pins. Town-level places get `precision: "town"` and the card says "מיקום משוער" (Kinneret, 2026-10-25: no special marker). If too few are exact, revisit with her.
- Views (Kinneret, 2026-10-25): **גלריה / מפה** toggle (`?v=map`), no side map. Switching is **instant** (show/hide, no animation): Kinneret tried a fade and then a sideways slide (25.10) and on 26.10 asked to go back to instant because the slide stuttered. The "על המפה" chip is light blue (`.mapbtn`, #BFDDEE). Above the map, **centred** (26.10: on the side it was hard to see): underlined link **"איך להשתמש במפה?"** (`components/MapHelp.tsx`, hover opens, click pins; her exact text: Waze note for town-level places, desktop/phone zoom and drag, hover/click, star). Under the map only "המלצת המערכת" with the yellow-circle black-star badge (the old hover hint line was removed). Ctrl/⌘ + wheel over the map zooms only the map, never the page (`GoogleMap.tsx` prevents the page zoom). Map markers = the category illustration on a white paper cutout (star badge = pick), smaller at the overview zoom. Hover (tap on phone) opens the place's **own card** (`PlaceCard` rendered into the Leaflet popup), so card and map popup can never differ. Place pages `/p/...`: since 2026-10-27 (GEO, PR #13, Kinneret) the place name on every card links to its page and the sitemap lists home + every place page (until then they were unlinked). They also serve as the share landing page (Kinneret 2026-10-26 morning: on that page no site title, only a sign link "לכל הפנינים" (`.sign`: yellow board, pointed end = arrow, on a small ink post; Kinneret 26.10 chose it over brown wood, which is not in the palette), share button light blue on the right, "לאתר" on the left, **no Waze button**, and the map zoomed to the place: zoom 15 for an exact spot, 13 for a town-level one (`PlaceMap` → `MapView zoom`); `og:image` = category picture from `public/share/`, absolute on the current deployment host via `SITE_URL` in `lib/slug.ts`). Share text (`lib/share.ts`, Kinneret 2026-10-25 evening): "מעניין אותי לבדוק את '[שם]'. בקצרה: [first sentence] (באזור [אזור]). / לכל הפרטים: [link] / מתוך האתר 'פנינים ישראליות': [place-page link]". **No Waze link** (locations are often town-level and a wrong pin disappoints). The share button sends text only (native share sheet on phones, clipboard on desktop; the site sends nothing, no paid service). **Open item for the END of the project:** the picture in the WhatsApp preview. Findings so far: Vercel Authentication is off (needed for previews); on desktop WhatsApp previewed the picture only when the link was the message's first line, which Kinneret rejected (left-aligned, bare link first). A map popup near the top edge opens below the marker, near a side edge it slides inward (`MapView` sets `below`/`--dx`/`--dy`). `cats[0]` is the place's main category (its icon); the admin form lets Kinneret pick it.
- Milestones M0–M5 (infra → 1:1 port → real map + geocoding → place pages/sharing → go-live → Neon + `/admin`) are all **done and live** (25–26.10.2026). Every change from now on: **a new PR with a Vercel Preview that Kinneret approves before merge**; a merged PR is never reused.
- Repo layout (built 2026-10-24, PR #1): site data `data/places.json` (copied from `places_site.json` by `scripts/import_places.py`, which keeps the repo-owned location fields); `scripts/validate-data.mjs` runs before every build; `lib/filters.ts` = the one filter used by list, map and counts; `lib/store.ts` reads Neon when `DATABASE_URL` is set, otherwise the JSON (an empty Neon table is seeded from the JSON once); `/admin` = password (`ADMIN_PASSWORD`) + signed cookie. **Editable site texts** (Kinneret, 26.10.2026): `/admin/texts` edits the popup, the map tip ("איך להשתמש במפה?"), the note under "עוד העדפות" and the place-page notes; defaults in `lib/texts.ts`, overrides in the Neon table `site_texts` (`getTexts()` in `lib/store.ts`, cache tag `texts`). When adding a public text that she may want to change, add a key there instead of hard-coding it. The card share message (`lib/share.ts`) is built from the `share.*` keys (the place name is `{שם}`), with a live example under them on `/admin/texts`; the card's share button reads the texts through `components/TextsContext.tsx`. **Admin list rows** (Kinneret, 26.10.2026): "המלצת המערכת", the main category (`cats[0]`; picking a category the place lacks adds it) and **"נבדק ידנית"** (new field `checked`, for after an AI gathered the details; admin only, stripped from the public data in `getPlaces()`) are changed right in the row and saved at once (`quickSave` → `patchPlace`, logged in `edits_log` as `quick`); the list has a "לא נבדקו ידנית" tab.
- Geocoding runs in GitHub Actions (`.github/workflows/geocode.yml`, triggered by pushing a change to `scripts/geocode.mjs`), because the Claude container cannot reach Nominatim or the places' websites. It writes `lat/lng/precision/geo_source` into `data/places.json` and a report to `data/geo_report.md`, and commits back to the branch.
- מצב נוכחי (27.10.2026): האתר חי ב-https://pninim-il.co.il (production נבנה אוטומטית מ-`main`; כתובת גיבוי `pearls-orpin.vercel.app`). **Neon מחובר** (מסד `pearls-db`, Free, iad1; `DATABASE_URL` ב-Production וב-Preview) והוא מקור האמת. **דף הניהול `/admin` פעיל**: כנרת הגדירה בעצמה את `ADMIN_PASSWORD` ב-Vercel (26.10). **לעולם לא לבקש ממנה את הסיסמה ולא לבקש שתשלח אותה בצ׳אט.** מוזגו לאחרונה: PR #5 ("לאתר", עמוד הפנינה בלי Waze), PR #6 (מעבר מיידי, "איך להשתמש במפה?" באמצע), PR #7 (מסך "טקסטים של האתר"), PR #8 (בשורת כל פנינה בניהול: "המלצת המערכת", קטגוריה עיקרית, "נבדק ידנית"; טקסטי השיתוף במסך הטקסטים; מוזג 26.10 21:49), PR #9 (שלט "לכל הפנינים" צהוב על עמוד). Vercel Authentication כבויה. פתוח: תמונת התצוגה המקדימה בוואטסאפ (מושהית לסוף הפרויקט), עגלות קפה כקטגוריה נפרדת.
- Domain: `pninim-il.co.il` (bought by Kinneret 25.10.2026, nameservers at kiwihosting.co.il) is attached to the Vercel project with `www` redirecting to it; DNS set-up belongs to the thread "חיבור הדומיין לאתר". `pninim.co.il` was taken. Vercel's fallback production URL is `pearls-orpin.vercel.app`.

## הוספת פנינה מקישור (סקיל `add-pearl`, 27.10.2026)

כנרת שולחת קישור; Claude אוסף את הפרטים ומכניס את הפנינה **כטיוטה**, שהיא בודקת לפני שהיא עולה לאתר.
- **טיוטה** = קובץ `data/drafts/<key>.json` בריפו (אותם שדות כמו פנינה, בלי `id`), ב-PR חדש. בתצוגה המקדימה של Vercel: `/draft/<key>` מציג את הכרטיס האמיתי + המפה עם הסיכה + הפרטים שלא בכרטיס (שבת, משפחות, מיקום, תגיות, שעות). לא מאונדקס ולא מקושר.
- **הוספה לאתר:** אחרי "אפשר למזג" ומיזוג, בדף הניהול "טיוטות מקישורים" (`/admin/drafts`) יש כפתור **"הוספה לאתר"** (server action `publishDraft` → `savePlace`, `checked: false`). פנינה באותו שם שכבר קיימת מוצגת "כבר באתר". קובץ הטיוטה נשאר בריפו עד שמנקים אותו ב-PR הבא.
- **כללי האיסוף (כנרת, 27.10.2026):** אם חסר מידע, מחפשים עוד באינטרנט (על כל פנינה יש בדרך כלל עוד מקורות). מצפורים/תצפיות/טבע פתוח = "פתוח בשבת" ו"גם למשפחות" אלא אם נאמר אחרת. עונתיות, צפיפות, "לוודא שעות" והגבלות אחרות נכנסות לסטריפ הצהוב (`note`), לא לתקציר. השם לא ירמוז שהמבקרים עושים משהו שהם לא עושים (לא "האכלת השקנאים" אלא "צפייה בשקנאים"). קטגוריה עיקרית = `cats[0]`, מוצעת לכנרת לאישור. מיקום: קואורדינטות ממקור (קישור Waze/Google בכתבה) = `precision: "exact"`, אחרת מרכז היישוב = `"town"`. `evidence` ואימיילים לא נכנסים לקובץ.
- הפנינה הראשונה שנוספה כך: "צפייה בשקנאים במצפור ויקר" (PR #11).

## טופסי הצעת פנינה ודיווח על טעות (27.10.2026)

- שני פופאפים (`components/Forms.tsx`, מוצגים בעמוד האודות): כל קישור ל-`#suggest` או ל-`#report` פותח אותם (`#report-<id>` בוחר פנינה), וגם כניסה לדף עם ה-hash הזה. בעמוד האודות הביטויים "להצעת פנינה", "כאן מדווחים" ו"דרך כאן" הופכים לקישורים אוטומטית (`linkForms`/`linkFaqForms` ב-`lib/texts.ts`).
- נוסח טופס ההצעה הוא של כנרת, מילה במילה (מפתחות `suggest.*`); טופס הדיווח (`report.*`) הוא הצעה של Claude עד שהיא תכתוב נוסח. כל הטקסטים נערכים ב-`/admin/forms`.
- איורים: `scripts/art/forms_art.py` (בלוט הפאביקון שוכב על הצד בין עלי אלון; מפה עם זכוכית מגדלת) → `ACORN_REST_SVG`/`REPORT_SVG` ב-`components/art.ts`.
- שמירה: טבלת Neon `submissions` (kind, data jsonb, status new/done, ip = hash בלבד). ספאם: שדה נסתר, מינימום 4 שניות, עד 3 קישורים, עד 8 שליחות בשעה מאותה כתובת (`app/actions.ts`). בניהול: `/admin/inbox` "הצעות ודיווחים" (טופל / מחיקה). מיילים ושמות ממליצים לא עולים לאתר; "המלצה של [שם]" רק למי שבחר "כן".
- השלב הבא (לא נבנה): ריצה יומית שהופכת הצעות לטיוטות עם הסקיל `add-pearl`, ודף אישור אחד עם כרטיסים ומפה.

## GEO / מנועי חיפוש ו-AI (27.10.2026)

- Audit + staged plan (Hebrew Claude Doc): https://claude.ai/artifact/6MUQicsCtZotrypmcy6w3K. Thread "בדיקת GEO ותוכנית שיפור לאתר".
- Done (PR #13): sitemap with all place pages, card name → place page, `canonical` on home, JSON-LD on home (WebSite + ItemList) and richer `TouristAttraction` on place pages, new meta description, Google Search Console verification tag in `app/layout.tsx`.
- **Google Search Console account = kinneret@drafttt.co.il** (not kinnerety@gmail.com). Bing Webmaster imported from GSC (27.10). Done since: `/p/<id>` numeric URLs (PR #14), meta description in her wording (PR #15), about page (PR #16/#18). Later stages: `llms.txt`, IndexNow, monthly AI-referrer report.
- **דפי אזור וקטגוריה (27.10.2026):** `/region/<slug>` (18) ו-`/category/<slug>` (11), כתובות באנגלית (`REGION_SLUG`/`CAT_SLUG` ב-`lib/config.ts`, כנרת: "השמות יהיו באנגלית"). כל דף = `components/Collection.tsx`: אותו `Hero` עם כותרת משלו ("פנינים ברמת הגולן" / שם הקטגוריה), אותו `Explorer` (גלריה + מפה + שאר הפילטרים, prop `scope`): בדף אזור אין ענני אזורים, בדף קטגוריה אין צ'יפים של קטגוריות אבל **ענני האזורים נשארים** (כנרת 27.10: "דווקא שם זה חשוב"); בשניהם החיפוש הוא תיבה קטנה מימין מעל העלים (`.qmini`, לא הסטריפ "לאן מכאן"), המונה אומר "12 פנינים באזור רמת הגולן" / "43 פנינים בקטגוריה 'משהו לאכול'", וכפתור **"לכל הפנינים"** (בלוט + מספר כל הפנינים באתר) הוא קישור לעמוד הבית (בדף אזור במקום "כל הפנינים", בדף קטגוריה מעל "עוד העדפות"). כותרת ארוכה מקבלת גופן קטן יותר (`header.long`/`.long2`). JSON-LD `CollectionPage`. **משפט הפתיחה** אוטומטי (`lib/intros.ts`: "12 פנינים ברמת הגולן: טבע ונוף, יקבים ועוד") אלא אם כנרת כתבה משלה ב-`/admin/intros` ("דפי אזור וקטגוריה", מפתחות `intro.region.*` / `intro.cat.*` ב-`lib/texts.ts`). **איורי ההדר** לפי ענן ולפי קטגוריה: `lib/headers.ts` (`ZONE_HERO`/`CAT_HERO`, inner SVG ל-viewBox 0 0 1200 440; מפתח חסר = הדר של עמוד הבית), ממולא בשרשור "עיצוב האדרים לדפי אזור וקטגוריה". קישורים: אינדקס בתחתית עמוד הבית ("לפי אזור: …", "לפי קטגוריה: …", `SiteFoot index`), שם האזור והקטגוריות בעמוד הפנינה, ו-`sitemap.xml`. כששם קטגוריה משתנה: לעדכן `lib/config.ts`, `data/places.json`, `scripts/share-images.cjs`, להוסיף הסבה ב-`ensure()` **ולהעלות את מפתח ה-cache של `getPlaces`** (`places-vN`), אחרת ה-Data Cache של Vercel ממשיך להגיש את השם הישן.

## מי אחראי על מה (שרשורים)

- **"בניית האתר פנינים ישראליות"** — owns the repo code; general site feedback goes there (its context is heavy: bigger jobs go to separate threads).
- **"שדרוג ממשק הניהול"** — owns `/admin` (since 26.10.2026); admin requests go there.
- **"החלפת המפה לגוגל מפות בעברית"** — map-view feedback goes there.
- **"חיבור הדומיין לאתר"** — domain/DNS (done 25.10.2026).
- **"עיצוב האדרים לדפי אזור וקטגוריה"** — draws `ZONE_HERO`/`CAT_HERO` in `lib/headers.ts` (generator `scripts/art/header_zones.py`); the pages themselves belong to the GEO thread.
- **"עיצוב האתר"** — owns the sketch (`site-sketch/template.html`) and published the sketch artifact. The sketch is **frozen** since M1; design changes are made in the repo and reviewed via Preview.
- **"מאגר הפנינים: קריאה ובדיקה"** — owned `/mnt/project-files/data/` before launch (place checks, merging Kinneret's marks); place data now lives in Neon via `/admin`. Convention: a card marked "סיימתי" with no change = she accepts Claude's recommendation; when she writes "ערכתי", pull her edits into the data.
- Rules for checking places: every link is actually checked (incl. FB/IG); search for the place's own website first. Shabbat only from what is written, else unknown. Families = Kinneret's call.
