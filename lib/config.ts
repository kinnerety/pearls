// 18 small regions, always visible, grouped into 4 clouds. Never merged (Kinneret, 2026-10-16).
export const ZONES: Record<string, string[]> = {
  'צפון': ['גולן', 'גליל עליון', 'גליל מערבי', 'גליל תחתון', 'עמק הירדן ובית שאן', 'עמק יזרעאל', 'חיפה והכרמל'],
  'מרכז': ['פרדס חנה-בנימינה-זיכרון', 'שרון', 'תל אביב', 'השפלה'],
  'ירושלים והאזור': ['ירושלים', 'שפלת יהודה והרי יהודה', 'מדבר יהודה וים המלח'],
  'דרום': ['נגב - החצי הצפוני', 'נגב מערבי', 'נגב - החצי הדרומי', 'ערבה'],
};
export const ZONE_NAMES = Object.keys(ZONES);
export const REGIONS = ZONE_NAMES.flatMap(z => ZONES[z]);

export const CATS = ['טבע ונוף', 'אוכל ושתייה', 'סדנאות', 'סיורים ומפגשים', 'חקלאות', 'בעלי חיים', 'יוצרים וחנויות', 'תרבות', 'עגלות קפה', 'אתרי אינטרנט'];

// Which illustration speaks for each category / region cloud / scenario
export const CAT_ILLO: Record<string, string> = {
  'טבע ונוף': 'valley', 'אוכל ושתייה': 'wine', 'סדנאות': 'apron', 'סיורים ומפגשים': 'speech', 'חקלאות': 'tractor',
  'בעלי חיים': 'hedgehog', 'יוצרים וחנויות': 'stand', 'תרבות': 'tile', 'עגלות קפה': 'coffee', 'אתרי אינטרנט': 'almond',
};
export const ZONE_ILLO: Record<string, string> = { 'צפון': 'kingfisher', 'מרכז': 'lifeguard', 'ירושלים והאזור': 'olive', 'דרום': 'ibex' };

// "עוד העדפות": only families / open on Shabbat / system pick (Kinneret, 2026-10-23)
export const PREFS = ['למשפחות', 'פתוח בשבת', 'המלצת המערכת'] as const;
export const PREF_LABEL: Record<string, string> = { 'למשפחות': 'גם למשפחות', 'פתוח בשבת': 'פתוח בשבת', 'המלצת המערכת': '★ המלצת המערכת' };
