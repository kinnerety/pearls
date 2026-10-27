import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getTexts, hasDb } from '@/lib/store';
import { SITE_KEYS } from '@/lib/texts';
import TextsForm from '@/components/admin/TextsForm';

export default async function SiteTexts() {
  if (!(await isAdmin())) redirect('/admin');
  const texts = await getTexts();
  return (
    <div className="adm-form">
      <div className="adm-top">
        <h1>טקסטים של האתר</h1>
        <div className="adm-row"><Link className="adm-btn ghost" href="/admin">→ לרשימה</Link></div>
      </div>
      {hasDb ? <TextsForm initial={texts} keys={SITE_KEYS} /> : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
    </div>
  );
}
