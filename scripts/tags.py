# Unified tag vocabulary for the site (display + filter).
# Raw tags in places_site.json came from per-place checks and are inconsistent; this maps them
# onto a small set of canonical tags, grouped for the filter. Anything not matched is dropped.
# Deliberately dropped: booking/coordination (Kinneret: every place says "check before you go"),
# family/kids (separate family tag), anything that repeats a category (סדנה, סיור, טעימות, חנות...),
# Shabbat (separate tag), negatives, and practical warnings (those belong in `note`).
import re

GROUPS = {
  'מה יש שם': ['תצפית', 'מים ומעיינות', 'פריחה', 'צפרות', 'פיקניק', 'מסלול הליכה קצר', 'השכרת אופניים', 'האכלת חיות'],
  'אוכל ושתייה': ['בית קפה ומאפייה', 'ארוחות', 'יין', 'בירה ומשקאות', 'גבינות', 'שמן זית', 'צמחוני', 'אורגני', 'כשר'],
  'יצירה ותרבות': ['גלריות ואמנות', 'מוזיאון', 'מוזיקה והופעות', 'שוק', "יד שנייה ווינטג'", 'עסק חברתי'],
  'שימושי לדעת': ['כניסה חינם', 'נגיש', 'עונתי', 'מותר עם כלבים', 'לינה'],
}

# canonical tag -> regex on the raw tag
RULES = [
  ('כניסה חינם', r'^(חינם|כניסה חופשית|כניסה חינם)'),
  ('נגיש', r'^נגיש|עגלות$|לעגלות|חנייה נגישה'),
  ('פריחה', r'פריח'),
  ('עונתי', r'^עונתי'),
  ('מותר עם כלבים', r'^כלבים (מותרים|ברצועה)'),
  ('לינה', r'^לינה'),
  ('תצפית', r'תצפי|^נוף$|דרך נוף|שקיעה'),
  ('מים ומעיינות', r'^מעיין|מים עד המותן'),
  ('צפרות', r'צפרות'),
  ('פיקניק', r'פיקניק'),
  ('מסלול הליכה קצר', r'הליכה קצרה|הליכה של|שביל קל|שבילים קצרים|מסלול קצר|שביל מעגלי'),
  ('השכרת אופניים', r'אופניים|גולףקארט'),
  ('האכלת חיות', r'האכל'),
  ('בית קפה ומאפייה', r'^בית קפה|ארוחת בוקר|^מאפייה'),
  ('ארוחות', r'^מסעדה|ארוח(ות|ת) (שף|ערב|בהזמנה)|ארוחה אורגנית|בראנץ'),
  ('יין', r'יין|^יקב$|סיורי יקב|חדר טעימות'),
  ('בירה ומשקאות', r'מבשלת|מזקקה'),
  ('גבינות', r'גבינ|חוות עיזים'),
  ('שמן זית', r'שמן זית|בית בד'),
  ('צמחוני', r'^צמחוני|^חלבי$'),
  ('אורגני', r'^אורגני'),
  ('כשר', r'^כשר$'),
  ('גלריות ואמנות', r'גלרי|אומנות מקומית'),
  ('מוזיאון', r'^מוזיאון'),
  ('מוזיקה והופעות', r'מוזיקה|הופעות|קונצרט|מופע'),
  ('שוק', r'^שוק'),
  ("יד שנייה ווינטג'", r'יד שנייה|וינטג'),
  ('עסק חברתי', r'עסק חברתי|הכשרה תעסוקתית|סחר הוגן'),
]
ORDER = [t for g in GROUPS.values() for t in g]

def canon(raw_tags):
    out = set()
    for r in raw_tags:
        for name, rx in RULES:
            if re.search(rx, r):
                out.add(name)
    # one tag per idea: "יין" already says the tasting; "פריחה" implies seasonal
    if 'פריחה' in out: out.discard('עונתי')
    return sorted(out, key=ORDER.index)

if __name__ == '__main__':
    import json, collections
    d = json.load(open('/mnt/project-files/data/places_site.json'))
    dropped = collections.Counter(r for p in d for r in p['tags'] if not any(re.search(rx, r) for _, rx in RULES))
    kept = collections.Counter(t for p in d for t in canon(p['tags']))
    print('canonical:', kept)
    print('dropped:', sorted(dropped.items(), key=lambda x: -x[1]))
