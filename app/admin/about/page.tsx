import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getTexts, hasDb } from '@/lib/store';
import { ABOUT_KEYS } from '@/lib/texts';
import TextsForm from '@/components/admin/TextsForm';
import TextsMenu from '@/components/admin/TextsMenu';

// The about page's texts, including its questions and answers (Kinneret, 27.10.2026)
export default async function AboutTexts() {
  if (!(await isAdmin())) redirect('/admin');
  const texts = await getTexts();
  return (
    <div className="adm-split">
      <TextsMenu />
      <div className="adm-form">
        <div className="adm-top">
          <h1>עמוד אודות</h1>
          <div className="adm-row">
            <Link className="adm-btn ghost" href="/about" target="_blank">לעמוד באתר</Link>
          </div>
        </div>
        {hasDb ? <TextsForm initial={texts} keys={ABOUT_KEYS} hint={'הטקסטים של עמוד האודות, לפי הסדר שבו הם מופיעים בעמוד. שינוי נשמר רק אחרי לחיצה על "שמירה".'} />
          : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
      </div>
    </div>
  );
}
