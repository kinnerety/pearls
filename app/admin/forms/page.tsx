import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getTexts, hasDb } from '@/lib/store';
import { FORM_KEYS } from '@/lib/texts';
import LiveTexts from '@/components/admin/LiveTexts';
import Forms from '@/components/Forms';
import TextsMenu from '@/components/admin/TextsMenu';

// The two popup forms (suggest a pearl / report a mistake) shown as they are on the site, every text edited in place
export default async function FormTexts() {
  if (!(await isAdmin())) redirect('/admin');
  const texts = await getTexts();
  return (
    <div className="adm-split">
      <TextsMenu />
      <div className="adm-form">
        <div className="adm-top">
          <h1>הטפסים</h1>
          <div className="adm-row">
            <Link className="adm-btn ghost" href="/about#suggest" target="_blank">טופס ההצעה באתר</Link>
            <Link className="adm-btn ghost" href="/about#report" target="_blank">טופס הדיווח באתר</Link>
          </div>
        </div>
        {hasDb ? (
          <LiveTexts initial={texts} keys={FORM_KEYS}>
            <p className="adm-hint">כל טופס מוצג פעמיים: הטופס עצמו, ואחריו ההודעה שרואים אחרי השליחה. השדות עצמם לא עובדים כאן, רק הטקסטים.</p>
            <Forms texts={texts} />
          </LiveTexts>
        ) : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
      </div>
    </div>
  );
}
