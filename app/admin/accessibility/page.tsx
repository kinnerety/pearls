import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getTexts, hasDb } from '@/lib/store';
import { A11Y_KEYS } from '@/lib/texts';
import TextsForm from '@/components/admin/TextsForm';
import TextsMenu from '@/components/admin/TextsMenu';

// The accessibility statement's texts (/accessibility)
export default async function A11yTexts() {
  if (!(await isAdmin())) redirect('/admin');
  const texts = await getTexts();
  return (
    <div className="adm-split">
      <TextsMenu />
      <div className="adm-form">
        <div className="adm-top">
          <h1>הצהרת נגישות</h1>
          <Link className="adm-btn ghost" href="/accessibility" target="_blank">לעמוד באתר</Link>
        </div>
        {hasDb ? <TextsForm initial={texts} keys={A11Y_KEYS} hint={'הטקסט של עמוד הצהרת הנגישות. "ברירת מחדל" מחזיר את הטיוטה הראשונה. שינוי נשמר רק אחרי לחיצה על "שמירה".'} />
          : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
      </div>
    </div>
  );
}
