// Site texts Kinneret can edit in /admin/texts (popup, map tip, notes). The defaults live here; edits are stored in Neon.
const ABOUT_HINT = 'כל שורה היא פסקה, ושורה ריקה מוסיפה רווח. **מילים בין כוכביות** יוצגו מודגשות, ==בין סימני שוויון== מסומנות במרקר, ו-[מילה](https://...) הופכת לקישור. [מילה](#suggest) פותחת את טופס הצעת הפנינה, ו-[מילה](#report) את טופס הדיווח על טעות.';

export type TextDef = { label: string; text: string; multi?: boolean; big?: boolean; hint?: string; faq?: boolean };

import { CATS, CAT_SLUG, REGIONS, REGION_SLUG } from './config';

// One intro line per region and per category page; all start with Kinneret's generic sentence (2026-10-27) and she edits each in /admin/intros
export const INTRO_GENERIC = 'המלצות שנתנו אנשים אמיתיים שביקרו ואהבו';
const INTRO_DEFAULTS = Object.fromEntries([
  ...REGIONS.map(r => [`intro.region.${REGION_SLUG[r]}`, { label: `פנינים ב${r}`, text: INTRO_GENERIC, multi: true }]),
  ...CATS.map(c => [`intro.cat.${CAT_SLUG[c]}`, { label: c, text: INTRO_GENERIC, multi: true }]),
]) as Record<`intro.${string}`, TextDef>;

const FIXED_DEFAULTS = {
  'popup.title': { label: 'פופאפ "לפני שנכנסים לאוטו": הכותרת', text: 'לפני שנכנסים לאוטו' },
  'popup.text': { label: 'פופאפ: הטקסט', text: 'חשוב להיכנס לאתר או לפרופיל של המקום ולוודא שהוא באמת מתאים לך. ההמלצות מגיעות מאנשים אמיתיים, אבל הפרטים נאספים על ידי AI', multi: true },
  'popup.once': { label: 'פופאפ: תיבת הסימון', text: 'לא להציג לי שוב את ההודעה הזאת עד הפעם הבאה' },
  'popup.button': { label: 'פופאפ: הכפתור', text: '100%, אבדוק גם בעצמי 👌' },
  'prefs.note': { label: 'המשפט הקטן מתחת ל"עוד העדפות"', text: 'יכול להיות שיש עוד פנינים שמתאימות למשפחות או פתוחות בשבת ולא סווגו ככאלה, ולהפך', multi: true },
  'maphelp.link': { label: 'הקישור מעל המפה', text: 'איך להשתמש במפה?' },
  'maphelp.important': { label: 'טיפ המפה: הפסקה הראשונה', text: 'חשוב: חלק מהפנינים ממוקמות בתוך היישוב באופן כללי, ולא במיקום מדויק ברמת הניווט לכתובת. כדי לנווט לשם, צריך להכניס ב-Waze את שם הפנינה.', multi: true, hint: 'מילה עם נקודתיים בתחילת הפסקה (כמו "חשוב:") תוצג מודגשת' },
  'maphelp.items': {
    label: 'טיפ המפה: הנקודות (שורה לכל נקודה)', multi: true,
    text: [
      'במחשב, כדי להתקרב ולהתרחק (זום-אין וזום-אאוט) צריך ללחוץ על הפלוס והמינוס, או לעמוד מעל למפה בלי ללחוץ עליה, ואז ללחוץ על קונטרול במקלדת (במק: ⌘) ולגלגל את גלגלת העכבר בו-זמנית. בטלפון פשוט מגדילים בשתי אצבעות.',
      'כדי להזיז את המפה במחשב צריך ללחוץ עליה עם העכבר ולגרור. בטלפון גוררים עם שתי אצבעות.',
      'במחשב, ריחוף על פנינה יפתח את ההסבר עליה.',
      'לחיצה על פנינה תשאיר את ההסבר פתוח.',
      'המלצות מערכת מסומנות בכוכב.',
    ].join('\n'),
  },
  'place.check': { label: 'עמוד הפנינה (הדף שהשיתוף מוביל אליו): ההערה בקופסה', text: 'לפני שנוסעים: ההמלצות מגיעות מאנשים אמיתיים, אבל הפרטים נאספים על ידי AI. כדאי להיכנס לאתר או לפרופיל של המקום ולבדוק שעות ותיאום.', multi: true },
  'share.open': { label: 'שיתוף פנינה: הפתיחה', text: "מעניין אותי לבדוק את '{שם}'.", hint: '{שם} יוחלף בשם הפנינה' },
  'share.short': { label: 'שיתוף: לפני המשפט הראשון של התיאור', text: 'בקצרה:' },
  'share.area': { label: 'שיתוף: לפני האזור (בסוגריים)', text: 'באזור' },
  'share.details': { label: 'שיתוף: לפני הקישור לאתר של המקום', text: 'לכל הפרטים:' },
  'share.site': { label: 'שיתוף: לפני הקישור לפנינה באתר שלנו', text: "מתוך האתר 'פנינים ישראליות':" },
  // the about page (/about), Kinneret's own text (27.10.2026). Every line is a paragraph; **bold**, ==marker==, [word](link)
  'about.h1': { label: 'עמוד "אודות": הכותרת', text: "מי מאחורי 'פנינים\u00A0ישראליות',\nובעיקר למה", multi: true, hint: 'שורה חדשה = ירידת שורה בכותרת' },
  'about.me': { label: 'אודות: הפסקה ליד האיור שלך', text: 'היי, אני כנרת יפרח :) כותבת ב[דראפט](http://www.drafttt.co.il), חובבת מסלולים מישוריים ומעגליים שלאורכם נחל ובסופם עגלת קפה.', multi: true, hint: ABOUT_HINT },
  'about.matti': { label: 'אודות: הפסקה ליד האיור של מתי', text: "וזה מתי, בנזוגי כפרה עליו. כולם חושבים שהוא הצ'ייסר, אבל הוא לא. הוא [אומן](https://kinnerety.wixstudio.com/turntable) וגם מבשל מעולה.", multi: true },
  'about.story': {
    label: 'אודות: יוני ואלן, עד הפוסט בפייסבוק', multi: true,
    text: [
      'יוני הוא אח של מתי, והוא נשוי לאלן (אני מבטיחה שזה מתקדם לאנשהו).',
      'יוני ואלן חיים בארצות הברית, אבל בשנים טובות, כשאין מגפות או מלחמות, הם באים כל שנה או שנתיים לבקר בארץ ולטייל איתנו.',
      '',
      '**לקראת הביקור הקודם שלהם בארץ, כתבתי בפייסבוק ככה:**',
    ].join('\n'),
  },
  'about.post.name': { label: 'אודות, הפוסט בפייסבוק: השם', text: 'כנרת יפרח' },
  'about.post.date': { label: 'אודות, הפוסט בפייסבוק: התאריך', text: '29 בינואר 2022' },
  'about.post': {
    label: 'אודות, הפוסט בפייסבוק: הטקסט', multi: true, big: true,
    text: [
      'צריכה המלצות:',
      'יש לנו כמה ימים חופש עם זוג אהוב מארה"ב שהיה בארץ כבר מלא פעמים, אז כיסינו כבר את כל המאסט.',
      '**הפעם בא לי להיות תיירת יחד איתם ולגלות פנינים שלא הכרתי.**',
      'מחפשת המלצות לחנויות קטנות ומקסימות ממש בכל קצות הארץ, גם במקומות מרוחקים; פינות טבע יפות ולא מוכרות; סדנאות אומנים שאפשר להיכנס ולהכיר; יקבים משפחתיים; מוזיאונים קטנטנים ומפתיעים ושאר חוויות בדרכים צדדיות. אוהבים במיוחד חנויות קטנות בעיירות קטנות (באנגלית זה נשמע יותר טוב).',
      'מבטיחה לשתף במסלול ובחוויות ולהמליץ בחזרה.',
      'אז איפה ביקרתםן לאחרונה והיה מרחיב לב?',
    ].join('\n'),
  },
  'about.trip': { label: 'אודות: אחרי הפוסט, לפני תמונת הפולארויד', multi: true, text: 'ההיענות הייתה מהממת וקיבלנו כ-150 המלצות. עברתי עליהן אחת-אחת, והכנתי לנו מסלול מצפון ועד דרום. זה היה הטיול הכי כיף, מרענן ומעניין שהיה לנו אי פעם בישראל.' },
  'about.list': { label: 'אודות: לפני התמונה של הרשימה המקורית', multi: true, text: 'כשחזרנו מהטיול, ארגנתי את כל ההמלצות ברשימה לטובת הציבור הרחב, כדי להעביר הלאה את כל הטוב הזה ולהחזיר תודה. זה היה לפני ששמענו על AI, הכול היה ידני, והרשימה נראתה ככה:' },
  'about.main': {
    label: 'אודות: מ"מה הן פנינים" ועד השאלות והתשובות', multi: true, big: true,
    hint: 'שורה שמתחילה ב-## היא כותרת. כל שורה אחרת היא פסקה.',
    text: [
      '## אז מה הן פנינים ישראליות?',
      'פנינים הן מקומות מעניינים, כיפיים וטעימים שמזמנים מפגש בלתי אמצעי עם הצדדים היפים של הארץ, כמו החקלאות המפוארת שלה, החי והצומח, היצירתיות, היופי, הנוף וישראלים כשהם במיטבם. יש כאן סיורים קולינריים, חוות, יקבים, נופים, תצפיות, שווקים, בתי בד, פיקניקים, סדנאות, מפגש עם חלקאים וחקלאיות, מבשלות ומזקקות, יוצרים ויוצרות, אגמים ומעיינות, חנויות מתוקות ועוד ועוד.',
      'יחד עם קלודוש העליתי את כל הפנינים לאתר חדש ויפה, עם אפשרויות לסנן אותן, עם לינקים למידע נוסף, והכי חשוב – עם אפשרות לראות אותן על מפה כדי לתכנן לכם מסלול.',
      'עכשיו האתר פתוח לכולם ולכולן, ואפשר למצוא בו רעיונות לגיחה קצרה ליד הבית, או למסלול שלם, או לביקור ליד המקום שאליו תכננתם לנסוע ממילא.',
      'כולם וכולן מוזמנים להציע פנינים חדשות. [להצעת פנינה](#suggest)',
      '',
      '## ההמלצות אנושיות לגמרי, AI יוצר מהן פנינים',
      'כל ההמלצות באתר ניתנות על ידי בני אדם שביקרו בהן ואהבו.',
      'אני נעזרת ב-AI כדי להוסיף מידע, לאמת מידע, לכתוב תקצירים, וכל מה שדורש שיטוט ברשת והעלאה טכנית לאתר.',
      'אחרי שקלוד מכין פנינים מההמלצות, אני קוראת ומאשרת אותן לפני שהן עולות לאתר.',
      '',
      '## האחריות היא על המטיילים והמטיילות בלבד, כלומר עליכם',
      '==זה חשוב, אז תהיו איתי רגע:==',
      'ההמלצות שאנחנו מקבלים נבדקות רק באופן מדגמי. לכן אין לנו אפשרות לדעת בוודאות שהמקום באמת פתוח בשבת (גם אם כתוב שכן), או שהוא באמת מתאים למשפחות, או שבאמת מגישים שם גם גבינות ולא רק יין, או שגם השנה יגיעו שקנאים באוקטובר.',
      'השילוב של המלצות אנושיות, שינויים תכופים במציאות ועבודת AI - לא מאפשר לתת ודאות.',
      'לכן המטרה של האתר היא לתת לכם ולכן **רעיונות**.',
      'מהרגע שרעיון מצא חן בעיניכם – **האחריות היא שלכם לבדוק אותו לפני שתצאו לדרך**, כדי לוודא בעצמכם שהוא בדיוק מה שרציתם, וגם לתאם אם צריך.',
      'ואם מצאתם טעות באתר, נשמח מאוד לשמוע על זה ולעדכן. [כאן מדווחים](#report)',
    ].join('\n'),
  },
  'about.faq.title': { label: 'אודות: הכותרת של השאלות והתשובות', text: 'שאלות ותשובות' },
  'about.faq': {
    label: 'אודות: שאלות ותשובות', multi: true, faq: true,
    text: [
      "### מה זה 'פנינים ישראליות'? מה יש באתר?",
      'אוסף המלצות שנתנו אנשים אמיתיים שביקרו במקומות האלה ואהבו אותם. יש כאן חוות, יקבים ומבשלות, סדנאות, יוצרים וחנויות קטנות, פניני תרבות ועוד המון המון דברים יפים.',
      '### למי זה מיועד?',
      'למי שרוצה לראות או לעשות משהו מעניין וייחודי ברחבי הארץ, ולא ללכת שוב לאותם מקומות מוכּרים.',
      '### אלה המלצות מניסיון אישי?',
      'כן, רק לא בהכרח שלנו. היינו בחלק מהמקומות, ואנשים אחרים המליצו על השאר. מצד שני, אנחנו לא עושים מבחני אמינות למי שהואילו להשקיע זמן ולהוסיף המלצה, אז הכי טוב לבדוק גם בעצמכם.',
      '### מה הופך מקום לפנינה?',
      'אנשים ונשים שמעניין לפגוש, הזדמנות להציץ לעולמות ייחודיים, עשייה מבורכת של ישראלים וישראליות, דברים יפים לראות, לעשות או לקנות, וחוויות שבדרך כלל לא פוגשים ליד הבית.',
      '### למה אין כאן מסעדות ובתי קפה?',
      'כי לא נצא מזה. אבל אנחנו פודיז, אז אולי בעתיד יהיו. כרגע התחלנו להוסיף עגלות קפה.',
      "### למה על חלק מהפנינים כתוב 'המלצת המערכת'?",
      'אלה פנינים עם שילוב מיוחד: גם היינו שם במו רגלינו, גם אהבנו מאוד, וגם נראה לנו שעוד אנשים יאהבו.',
      '### אני רוצה להמליץ על פנינה. איך עושים את זה?',
      'קל, [דרך כאן](#suggest)',
      '### מצאתי מידע לא נכון באחת ההמלצות באתר וממש אשמח לדווח. למי אומרים?',
      'לנו, [דרך כאן](#report)',
    ].join('\n'),
  },
  // the gallery when no pearl matches the filters (Kinneret's wording, 27.10.2026)
  'empty.top': { label: 'כשאין תוצאות: השורה למעלה (ליד האיור הקטן)', text: 'אין לנו פנינים שמתאימות להגדרות שבחרת' },
  'empty.text': { label: 'כשאין תוצאות: הטקסט מתחת לשריון הצב', text: 'אין כאן פנינים מתאימות, אבל אם יצא לך למצוא פנינה כזאת, נשמח להמלצה', multi: true },
  'empty.button': { label: 'כשאין תוצאות: הכפתור (פותח את טופס ההצעה)', text: 'להמליץ על פנינה' },
  // the "suggest a pearl" form (Kinneret's wording, 27.10.2026). Each question has its line of explanation under it
  'suggest.title': { label: 'טופס הצעת פנינה: הכותרת', text: 'תודה שבחרת לשתף איתנו פנינה משלך!' },
  'suggest.name': { label: 'הצעת פנינה: שאלה 1', text: 'איך קוראים למקום?' },
  'suggest.name.hint': { label: 'הצעת פנינה: ההסבר לשאלה 1', text: 'אם אין לו שם - אז רק מה זה, 3-5 מילים' },
  'suggest.what': { label: 'הצעת פנינה: שאלה 2', text: 'מה זה בדיוק?' },
  'suggest.what.hint': { label: 'הצעת פנינה: ההסבר לשאלה 2', text: "חווה, חנות, גלריה, אומן או אומנית, סיור, יקב, תצפית, נחל, עגלת קפה וכו'" },
  'suggest.link': { label: 'הצעת פנינה: שאלה 3 (קישור)', text: 'יש למקום לינק עם מידע?' },
  'suggest.link.hint': { label: 'הצעת פנינה: ההסבר לשאלה 3', text: 'אם אין, אפשר פשוט להשאיר ריק' },
  'suggest.where': { label: 'הצעת פנינה: שאלה 3', text: 'איפה זה?' },
  'suggest.where.hint': { label: 'הצעת פנינה: ההסבר לשאלה 3', text: 'לא צריך לכתוב איך מגיעים, אבל נשמח לשם של יישוב או של נקודת ציון סמוכה', multi: true },
  'suggest.love': { label: 'הצעת פנינה: שאלה 4', text: 'מה אהבת בפנינה הזאת?' },
  'suggest.love.hint': { label: 'הצעת פנינה: ההסבר לשאלה 4', text: 'לא חובה, אבל נשמח לדעת' },
  'suggest.shabbat': { label: 'הצעת פנינה: השאלה על שבת', text: 'ידוע לך אם המקום פתוח בשבת?' },
  'suggest.family': { label: 'הצעת פנינה: השאלה על משפחות', text: 'ידוע לך אם זה מתאים גם למשפחות?' },
  'suggest.choices': { label: 'הצעת פנינה: התשובות לשבת ולמשפחות (שורה לכל תשובה: כן / לא / לא יודעים)', text: 'כן\nלא\nאין לי מושג', multi: true },
  'suggest.more': { label: 'הצעת פנינה: עוד משהו חשוב', text: 'יש עוד משהו שחשוב להגיד למי שמתכננים להגיע?' },
  'suggest.more.hint': { label: 'הצעת פנינה: ההסבר ל"עוד משהו חשוב"', text: 'למשל, אם זה פתוח רק יום בשבוע, או רק בעונה מסוימת, או שממש כדאי לא להגיע בסופ"ש', multi: true },
  'suggest.credit': { label: 'הצעת פנינה: לציין את הממליץ?', text: 'רוצה שנציין שקיבלנו ממך את ההמלצה?' },
  'suggest.credit.hint': { label: 'הצעת פנינה: ההסבר לציון הממליץ', text: "על הפנינה יהיה כתוב: 'המלצה של [השם שלך]'" },
  'suggest.credit.yes': { label: 'הצעת פנינה: "כן" לציון הממליץ', text: 'כן, בכיף' },
  'suggest.credit.ask': { label: 'הצעת פנינה: מה נפתח אחרי "כן" (לפני השדה לשם)', text: 'מעולה! אז מה שמך?' },
  'suggest.credit.no': { label: 'הצעת פנינה: "לא" לציון הממליץ', text: 'לא, תודה :)' },
  'suggest.email': { label: 'הצעת פנינה: אפשר לשלוח מייל?', text: 'אם יהיו לנו שאלות על הפנינה, אפשר לשלוח לך מייל? רק לצורך זה, מבטיחים!', multi: true },
  'suggest.email.yes': { label: 'הצעת פנינה: "כן" למייל', text: 'בטח' },
  'suggest.email.ask': { label: 'הצעת פנינה: מה נפתח אחרי "כן" (לפני השדה למייל)', text: 'תודה! מה המייל שלך?' },
  'suggest.email.no': { label: 'הצעת פנינה: "לא" למייל', text: "בשביל מה יש צ'אטים?" },
  'suggest.agree': { label: 'הצעת פנינה: תיבת הסימון', text: "ידוע לי שצוות 'פנינים ישראליות' עובר על הפנינים ומחליט איזו מהן להעלות, אז לא בטוח שההמלצה שלי תעלה לאתר", multi: true },
  'suggest.send': { label: 'הצעת פנינה: הכפתור', text: 'שליחה' },
  'suggest.done.title': { label: 'הצעת פנינה: הודעת ההצלחה, הכותרת', text: 'תודה רבה!' },
  'suggest.done.text': { label: 'הצעת פנינה: הודעת ההצלחה, הטקסט', multi: true, text: 'זה ממש לא מובן מאליו שהשקעת זמן כדי לשתף עם כולנו פנינה ישראלית.\nאנחנו מעלים פנינים חדשות במרוכז בערך כל שבועיים.' },
  'suggest.done.button': { label: 'הצעת פנינה: הכפתור בהודעת ההצלחה', text: 'חזרה לגלריית הפנינים' },
  // the "report a mistake" form (Kinneret's wording, 27.10.2026 afternoon)
  'report.title': { label: 'טופס דיווח על טעות: הכותרת', text: 'מצאת טעות? תודה שסיפרת לנו!' },
  'report.place': { label: 'דיווח על טעות: שאלה 1', text: 'באיזו פנינה מדובר?' },
  'report.place.hint': { label: 'דיווח על טעות: ההסבר לשאלה 1', text: 'אם הטעות לא קשורה לפנינה מסוימת, אפשר להשאיר ריק' },
  'report.what': { label: 'דיווח על טעות: שאלה 2', text: 'מה לא נכון?' },
  'report.what.hint': { label: 'דיווח על טעות: ההסבר לשאלה 2', text: 'למשל: המקום נסגר, השעות השתנו, הקישור לא עובד, המיקום על המפה לא נכון', multi: true },
  'report.email': { label: 'דיווח על טעות: אפשר לשלוח מייל?', text: 'אם יהיו לנו שאלות, אפשר לשלוח לך מייל? רק לצורך זה, מבטיחים!', multi: true },
  'report.email.yes': { label: 'דיווח על טעות: "כן" למייל', text: 'בטח' },
  'report.email.ask': { label: 'דיווח על טעות: מה נפתח אחרי "כן"', text: 'תודה! מה המייל שלך?' },
  'report.email.no': { label: 'דיווח על טעות: "לא" למייל', text: 'לא, תודה' },
  'report.send': { label: 'דיווח על טעות: הכפתור', text: 'שליחה' },
  'report.done.title': { label: 'דיווח על טעות: הודעת ההצלחה, הכותרת', text: 'תודה רבה!' },
  'report.done.text': { label: 'דיווח על טעות: הודעת ההצלחה, הטקסט', multi: true, text: 'נבדוק את העניין ונתקן בהקדם את מה שצריך.\nזה לא מובן מאליו שהשקעת זמן בלספר לנו על זה, אנחנו מאוד מעריכים את זה' },
  'report.done.button': { label: 'דיווח על טעות: הכפתור בהודעת ההצלחה', text: 'חזרה לגלריית הפנינים' },
  'contact.title': { label: 'טופס יצירת קשר: הכותרת', text: 'נשמח לשמוע ממך :)' },
  'contact.subtitle': { label: 'יצירת קשר: המשפט מתחת לכותרת', text: 'דרך הטופס הזה אפשר לפנות אלינו מהר ובקלות' },
  'contact.topic': { label: 'יצירת קשר: השאלה על הנושא', text: 'באיזה עניין?' },
  'contact.topic.pick': { label: 'יצירת קשר: מה כתוב ברשימה לפני שבוחרים', text: 'בחירת נושא' },
  'contact.topics': { label: 'יצירת קשר: הנושאים ברשימה (שורה לכל נושא, בסדר הזה: המלצה / טעות / שאלה על פנינה / משהו אחר)', multi: true, text: 'המלצה על פנינה\nדיווח על טעות באתר\nשאלה על פנינה שראיתי באתר\nמשהו אחר' },
  'contact.question': { label: 'יצירת קשר: מה מופיע כשבוחרים "שאלה על פנינה"', multi: true, text: 'תודה! אין לנו עוד פרטים על הפנינים מעבר למה שמופיע כאן.\nלמידע נוסף צריך לעבור לאתר המקורי של הפנינה דרך הכפתור שמופיע לידה.' },
  'contact.name': { label: 'יצירת קשר, "משהו אחר": שאלה 1', text: 'מה שמך?' },
  'contact.email': { label: 'יצירת קשר, "משהו אחר": שאלה 2', text: 'מה המייל שלך?' },
  'contact.email.hint': { label: 'יצירת קשר, "משהו אחר": ההסבר לשאלה 2', text: 'חשוב: אנחנו לא מבטיחים לחזור לכל פנייה' },
  'contact.message': { label: 'יצירת קשר, "משהו אחר": שאלה 3', text: 'מה רצית להגיד לנו?' },
  'contact.send': { label: 'יצירת קשר: הכפתור', text: 'שליחה' },
  'contact.done.title': { label: 'יצירת קשר: הודעת ההצלחה, הכותרת', text: 'תודה!' },
  'contact.done.text': { label: 'יצירת קשר: הודעת ההצלחה, הטקסט', multi: true, text: 'הפנייה הגיעה אלינו. יכול לקחת לנו שבועיים פלוס מינוס לקרוא ולהגיב אם צריך' },
  'contact.done.button': { label: 'יצירת קשר: הכפתור בהודעת ההצלחה', text: 'חזרה לגלריית הפנינים' },
  'about.back': { label: 'אודות: הכפתור בתחתית העמוד', text: 'חזרה לגלריית הפנינים' },
  'about.link': { label: 'הקישור לעמוד "אודות" בתחתית העמודים', text: 'אודות' },
} satisfies Record<string, TextDef>;

export type TextKey = keyof typeof FIXED_DEFAULTS | `intro.region.${string}` | `intro.cat.${string}`;
export const TEXT_DEFAULTS: Record<TextKey, TextDef> = { ...INTRO_DEFAULTS, ...FIXED_DEFAULTS };
export type Texts = Record<TextKey, string>;
export const TEXT_KEYS = Object.keys(TEXT_DEFAULTS) as TextKey[];
/** The about page's own texts get their own admin screen (/admin/about); the rest stay in /admin/texts */
export const ABOUT_KEYS = TEXT_KEYS.filter(k => k.startsWith('about.') && k !== 'about.link');
/** The popup forms' texts (suggest, report, contact) get their own admin screen (/admin/forms) */
export const FORM_KEYS = TEXT_KEYS.filter(k => k.startsWith('suggest.') || k.startsWith('report.') || k.startsWith('contact.'));
export const INTRO_KEYS = TEXT_KEYS.filter(k => k.startsWith('intro.'));
export const SITE_KEYS = TEXT_KEYS.filter(k => !ABOUT_KEYS.includes(k) && !INTRO_KEYS.includes(k) && !FORM_KEYS.includes(k));
export const DEFAULT_TEXTS = Object.fromEntries(TEXT_KEYS.map(k => [k, TEXT_DEFAULTS[k].text])) as Texts;

/** The about page's main text: every line is a paragraph, "## " = a section heading */
export type AboutBlock = { kind: 'h2' | 'p'; text: string };
export function parseAbout(s: string): AboutBlock[] {
  return s.split('\n').map(l => l.trim()).filter(Boolean).map((line): AboutBlock =>
    line.startsWith('## ') ? { kind: 'h2', text: line.slice(3).trim() }
    : { kind: 'p', text: line });
}

/** **bold**, ==marker== and [word](link) in an about text, as plain text (for search engines) */
export const plainText = (s: string) => s.replace(/\*\*|==/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

/** "חשוב: ..." → the word before the colon in bold */
export function splitLead(s: string): [string, string] {
  const m = /^([^:\n]{1,12}:)\s*([\s\S]*)$/.exec(s);
  return m ? [m[1], m[2]] : ['', s];
}

/** The about page's questions and answers: a "### question" line, then its answer lines */
export type Faq = { q: string; a: string };
export function parseFaq(s: string): Faq[] {
  const out: Faq[] = [];
  for (const raw of s.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('### ')) out.push({ q: line.slice(4).trim(), a: '' });
    else if (line && out.length) { const f = out[out.length - 1]; f.a = f.a ? f.a + '\n' + line : line; }
  }
  return out;
}
export const faqText = (items: Faq[]) => items.filter(f => f.q.trim() || f.a.trim())
  .map(f => `### ${f.q.replace(/\s*\n\s*/g, ' ').trim()}\n${f.a.trim()}`).join('\n');

/** The about page's form phrases ("להצעת פנינה", "כאן מדווחים", "דרך כאן") become links that open the popup forms,
 *  also in texts saved before the forms existed (a phrase Kinneret already linked is left alone). */
const bare = (phrase: string) => new RegExp(`(?<!\\[)${phrase}(?!\\])`);
export function linkForms(s: string): string {
  return s.replace(bare('להצעת פנינה'), '[להצעת פנינה](#suggest)').replace(bare('כאן מדווחים'), '[כאן מדווחים](#report)');
}
export function linkFaqForms(items: Faq[]): Faq[] {
  return items.map(f => ({ ...f, a: f.a.replace(bare('דרך כאן'), `[דרך כאן](#${/טעות|לדווח|לא נכון/.test(f.q) ? 'report' : 'suggest'})`) }));
}
