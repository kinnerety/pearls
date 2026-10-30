# סקריפטים

- `import_places.py` — מעתיק את `/mnt/project-files/data/places_site.json` אל `data/places.json` (בלי שדות פנימיים, עם `ctags` מ-`tags.py`). שדות מיקום שהריפו מחזיק (precision, address) נשמרים בייבוא חוזר.
  ```
  python3 scripts/import_places.py
  ```
- `validate-data.mjs` — רץ אוטומטית לפני כל build (`npm run build`). אם הנתונים שבורים, הבנייה נכשלת ושום דבר לא עולה לאתר.
- `tags.py` — מילון התגיות האחיד (עותק מ-`site-sketch/tags.py`).
- `share-images.cjs` — מייצר את תמונות התצוגה המקדימה של קישורים משותפים (og:image) אל `public/share/`: `cat-<קטגוריה>.jpg` לכל קטגוריה ו-`zone-<ענן>.jpg` לכל ענן אזורים, 1200×630: האייקון של הקטגוריה/הענן (`lib/illo.ts`) על עיגול נייר לבן עם הכותרת. צריך Playwright ורשת (הפונטים מגוגל). אחרי שינוי באייקון: `node scripts/share-images.cjs`.
