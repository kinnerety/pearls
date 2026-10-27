import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getTexts, hasDb } from '@/lib/store';
import { FORM_KEYS } from '@/lib/texts';
import TextsForm from '@/components/admin/TextsForm';

// The texts of the two popup forms (suggest a pearl / report a mistake), in the order they appear
export default async function FormTexts() {
  if (!(await isAdmin())) redirect('/admin');
  const texts = await getTexts();
  return (
    <div className="adm-form">
      <div className="adm-top">
        <h1>טקסטים של הטפסים</h1>
        <div className="adm-row">
          <Link className="adm-btn ghost" href="/admin/inbox">→ להצעות ולדיווחים</Link>
          <Link className="adm-btn ghost" href="/about#suggest" target="_blank">טופס ההצעה באתר</Link>
          <Link className="adm-btn ghost" href="/about#report" target="_blank">טופס הדיווח באתר</Link>
        </div>
      </div>
      {hasDb ? <TextsForm initial={texts} keys={FORM_KEYS} hint={'הטקסטים של טופס הצעת פנינה ושל טופס הדיווח על טעות, לפי הסדר בטופס. שינוי נשמר רק אחרי לחיצה על "שמירה".'} />
        : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
    </div>
  );
}
