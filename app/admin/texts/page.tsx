import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getTexts, hasDb } from '@/lib/store';
import { SITE_KEYS } from '@/lib/texts';
import LiveTexts from '@/components/admin/LiveTexts';
import CheckPopup from '@/components/CheckPopup';
import MapHelp from '@/components/MapHelp';
import TextsMenu from '@/components/admin/TextsMenu';

// The popup and the map tip are shown as they are on the site and edited in place; the rest as plain fields
const LIVE = SITE_KEYS.filter(k => k.startsWith('popup.') || k.startsWith('maphelp.'));
const FIELDS = SITE_KEYS.filter(k => !LIVE.includes(k));

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
        {hasDb ? (
          <LiveTexts initial={texts} keys={SITE_KEYS} fields={FIELDS}>
            <h2 className="adm-h2">הפופאפ "לפני שנכנסים לאוטו"</h2>
            <p className="adm-hint">נפתח כשבוחרים "גם למשפחות" או "פתוח בשבת".</p>
            <CheckPopup texts={texts} />
            <h2 className="adm-h2">הטיפ מעל המפה</h2>
            <MapHelp texts={texts} />
          </LiveTexts>
        ) : <div className="adm-card"><p>אין עדיין מסד נתונים מחובר, אז אי אפשר לשמור טקסטים.</p></div>}
      </div>
    </div>
  );
}
