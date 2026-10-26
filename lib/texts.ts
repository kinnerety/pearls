// Site texts Kinneret can edit in /admin/texts (popup, map tip, notes). The defaults live here; edits are stored in Neon.
export type TextDef = { label: string; text: string; multi?: boolean; hint?: string };

export const TEXT_DEFAULTS = {
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
  'place.approx': { label: 'עמוד הפנינה: מתחת למפה כשהמיקום משוער', text: 'מיקום משוער, בתוך היישוב. פרטי הגעה מדויקים באתר המקום' },
  'share.open': { label: 'שיתוף פנינה: הפתיחה', text: "מעניין אותי לבדוק את '{שם}'.", hint: '{שם} יוחלף בשם הפנינה' },
  'share.short': { label: 'שיתוף: לפני המשפט הראשון של התיאור', text: 'בקצרה:' },
  'share.area': { label: 'שיתוף: לפני האזור (בסוגריים)', text: 'באזור' },
  'share.details': { label: 'שיתוף: לפני הקישור לאתר של המקום', text: 'לכל הפרטים:' },
  'share.site': { label: 'שיתוף: לפני הקישור לפנינה באתר שלנו', text: "מתוך האתר 'פנינים ישראליות':" },
} satisfies Record<string, TextDef>;

export type TextKey = keyof typeof TEXT_DEFAULTS;
export type Texts = Record<TextKey, string>;
export const TEXT_KEYS = Object.keys(TEXT_DEFAULTS) as TextKey[];
export const DEFAULT_TEXTS = Object.fromEntries(TEXT_KEYS.map(k => [k, TEXT_DEFAULTS[k].text])) as Texts;

/** "חשוב: ..." → the word before the colon in bold */
export function splitLead(s: string): [string, string] {
  const m = /^([^:\n]{1,12}:)\s*([\s\S]*)$/.exec(s);
  return m ? [m[1], m[2]] : ['', s];
}
