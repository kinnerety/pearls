# סקריפטים

- `import_places.py` — מעתיק את `/mnt/project-files/data/places_site.json` אל `data/places.json` (בלי שדות פנימיים, עם `ctags` מ-`tags.py`). שדות מיקום שהריפו מחזיק (precision, address) נשמרים בייבוא חוזר.
  ```
  python3 scripts/import_places.py
  ```
- `validate-data.mjs` — רץ אוטומטית לפני כל build (`npm run build`). אם הנתונים שבורים, הבנייה נכשלת ושום דבר לא עולה לאתר.
- `tags.py` — מילון התגיות האחיד (עותק מ-`site-sketch/tags.py`).
