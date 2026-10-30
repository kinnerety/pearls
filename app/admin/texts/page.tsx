import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getTexts, hasDb } from '@/lib/store';
import { SITE_KEYS } from '@/lib/texts';
import TextsForm from '@/components/admin/TextsForm';
import TextsMenu from '@/components/admin/TextsMenu';

export default async function SiteTexts() {
  if (!(await isAdmin())) redirect('/admin');
  const texts = await getTexts();
  return (
    <div className="adm-split">
      <TextsMenu />
      <div className="adm-form">
        <div className="adm-top">
          <h1>הודעות וטקסטים באתר</h1>
          <Link className="adm-btn ghost" href="/" target="_blank">לראות באתר</Link>
        </div>
        {hasDb ? <TextsForm initial={texts} keys={SITE_KEYS} /> : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
      </div>
    </div>
  );
}
