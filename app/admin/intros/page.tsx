import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getPlaces, getTexts, hasDb } from '@/lib/store';
import { INTRO_KEYS, type TextKey } from '@/lib/texts';
import { CATS, CAT_SLUG, REGIONS, REGION_SLUG } from '@/lib/config';
import { catIntro, regionIntro } from '@/lib/intros';
import TextsForm from '@/components/admin/TextsForm';

// The intro line of each region and category page; an empty field shows the automatic sentence (shown here as the placeholder)
export default async function IntroTexts() {
  if (!(await isAdmin())) redirect('/admin');
  const [texts, places] = await Promise.all([getTexts(), getPlaces()]);
  const auto: Partial<Record<TextKey, string>> = {};
  for (const r of REGIONS) auto[`intro.region.${REGION_SLUG[r]}`] = regionIntro(r, places.filter(p => p.region.includes(r)));
  for (const c of CATS) auto[`intro.cat.${CAT_SLUG[c]}`] = catIntro(c, places.filter(p => p.cats.includes(c)));
  return (
    <div className="adm-form">
      <div className="adm-top">
        <h1>דפי אזור וקטגוריה</h1>
        <div className="adm-row"><Link className="adm-btn ghost" href="/admin">→ לרשימה</Link></div>
      </div>
      {hasDb ? <TextsForm initial={texts} keys={INTRO_KEYS} placeholders={auto} hint={'משפט הפתיחה מתחת לכותרת של כל דף אזור וקטגוריה. שדה ריק = המשפט האוטומטי שמופיע בו באפור. שינוי נשמר רק אחרי לחיצה על "שמירה".'} />
        : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
    </div>
  );
}
