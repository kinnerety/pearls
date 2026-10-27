// 18 small regions, always visible, grouped into 4 clouds. Never merged (Kinneret, 2026-10-16).
export const ZONES: Record<string, string[]> = {
  'צפון': ['רמת הגולן', 'גליל עליון', 'גליל מערבי', 'גליל תחתון', 'עמק הירדן ובית שאן', 'עמק יזרעאל', 'חיפה והכרמל'],
  'מרכז': ['פרדס חנה-בנימינה-זיכרון', 'שרון', 'תל אביב', 'השפלה'],
  'ירושלים והאזור': ['ירושלים', 'שפלת יהודה והרי יהודה', 'מדבר יהודה וים המלח'],
  'דרום': ['נגב - החצי הצפוני', 'נגב מערבי', 'נגב - החצי הדרומי', 'ערבה'],
};
export const ZONE_NAMES = Object.keys(ZONES);
export const REGIONS = ZONE_NAMES.flatMap(z => ZONES[z]);

export const CATS = ['טבע ונוף', 'משהו לאכול', 'יקבים, מבשלות ומזקקות', 'סדנאות', 'סיורים ומפגשים', 'חקלאות', 'בעלי חיים', 'יוצרים וחנויות', 'תרבות', 'עגלות קפה', 'אתרי אינטרנט'];

// Which illustration speaks for each category / region cloud / scenario
export const CAT_ILLO: Record<string, string> = {
  'טבע ונוף': 'valley', 'משהו לאכול': 'bread', 'יקבים, מבשלות ומזקקות': 'wine', 'סדנאות': 'apron', 'סיורים ומפגשים': 'finjan', 'חקלאות': 'tractor',
  'בעלי חיים': 'hedgehog', 'יוצרים וחנויות': 'stand', 'תרבות': 'tile', 'עגלות קפה': 'coffee', 'אתרי אינטרנט': 'almond',
};
// English addresses for the region and category pages (Kinneret, 2026-10-27: Hebrew in a URL turns into %D7%... when shared)
export const REGION_SLUG: Record<string, string> = {
  'רמת הגולן': 'golan', 'גליל עליון': 'upper-galilee', 'גליל מערבי': 'western-galilee', 'גליל תחתון': 'lower-galilee',
  'עמק הירדן ובית שאן': 'jordan-valley-beit-shean', 'עמק יזרעאל': 'jezreel-valley', 'חיפה והכרמל': 'haifa-carmel',
  'פרדס חנה-בנימינה-זיכרון': 'pardes-hanna-binyamina-zichron', 'שרון': 'sharon', 'תל אביב': 'tel-aviv', 'השפלה': 'shfela',
  'ירושלים': 'jerusalem', 'שפלת יהודה והרי יהודה': 'judean-hills', 'מדבר יהודה וים המלח': 'judean-desert-dead-sea',
  'נגב - החצי הצפוני': 'northern-negev', 'נגב מערבי': 'western-negev', 'נגב - החצי הדרומי': 'southern-negev', 'ערבה': 'arava',
};
export const CAT_SLUG: Record<string, string> = {
  'טבע ונוף': 'nature', 'משהו לאכול': 'food', 'יקבים, מבשלות ומזקקות': 'wineries-breweries', 'סדנאות': 'workshops', 'סיורים ומפגשים': 'tours',
  'חקלאות': 'farms', 'בעלי חיים': 'animals', 'יוצרים וחנויות': 'makers-shops', 'תרבות': 'culture', 'עגלות קפה': 'coffee-carts', 'אתרי אינטרנט': 'websites',
};
const flip = (m: Record<string, string>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [v, k]));
export const REGION_OF_SLUG = flip(REGION_SLUG);
export const CAT_OF_SLUG = flip(CAT_SLUG);
export const zoneOf = (region: string) => ZONE_NAMES.find(z => ZONES[z].includes(region));

export const ZONE_ILLO: Record<string, string> = { 'צפון': 'kingfisher', 'מרכז': 'lifeguard', 'ירושלים והאזור': 'olive', 'דרום': 'ibex' };

// "עוד העדפות": only families / open on Shabbat / system pick (Kinneret, 2026-10-23)
export const PREFS = ['למשפחות', 'פתוח בשבת', 'המלצת המערכת'] as const;
export const PREF_LABEL: Record<string, string> = { 'למשפחות': 'גם למשפחות', 'פתוח בשבת': 'פתוח בשבת', 'המלצת המערכת': '★ המלצת המערכת' };
