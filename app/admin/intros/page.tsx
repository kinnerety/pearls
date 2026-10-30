import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getTexts, hasDb } from '@/lib/store';
import { INTRO_GENERIC, INTRO_KEYS } from '@/lib/texts';
import TextsForm from '@/components/admin/TextsForm';
import TextsMenu from '@/components/admin/TextsMenu';

// The intro line of each region and category page; every field holds its current sentence as editable text
export default async function IntroTexts() {
  if (!(await isAdmin())) redirect('/admin');
  const texts = await getTexts();
  // A field saved empty (before 27.10 empty meant "automatic") shows the sentence the page now uses
  for (const k of INTRO_KEYS) if (!texts[k]?.trim()) texts[k] = INTRO_GENERIC;
  return (
    <div className="adm-split">
      <TextsMenu />
      <div className="adm-form">
        <div className="adm-top">
          <h1>דפי אזור וקטגוריה</h1>
          <Link className="adm-btn ghost" href="/region/golan" target="_blank">דוגמה באתר</Link>
        </div>
        {hasDb ? <TextsForm initial={texts} keys={INTRO_KEYS} hint={'משפט הפתיחה מתחת לכותרת של כל דף אזור וקטגוריה. "ברירת מחדל" מחזיר את המשפט הכללי. שינוי נשמר רק אחרי לחיצה על "שמירה".'} />
          : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
      </div>
    </div>
  );
}
