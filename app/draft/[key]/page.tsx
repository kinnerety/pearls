import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDraft } from '@/lib/drafts';
import { getTexts } from '@/lib/store';
import PlaceCard from '@/components/PlaceCard';
import PlaceMap from '@/components/PlaceMap';
import { TextsProvider } from '@/components/TextsContext';
import { isApprox } from '@/lib/geo';

// A draft pearl, exactly as its card and map pin will look on the site, for Kinneret to check before it is added.
// Not linked from anywhere and not indexed.
type Props = { params: Promise<{ key: string }> };
export const metadata: Metadata = { title: 'טיוטה | פנינים ישראליות', robots: { index: false, follow: false } };

export default async function DraftPage({ params }: Props) {
  const d = getDraft((await params).key);
  if (!d) notFound();
  const { place: p } = d;
  const texts = await getTexts();
  return (
    <div className="wrap draft-page">
      <div className="draft-banner">
        <b>טיוטה, עוד לא באתר.</b> ככה הפנינה תיראה בגלריה ועל המפה.
        {' '}<Link href="/">לאתר</Link> · <Link href="/admin/drafts">להוספה דרך דף הניהול</Link>
      </div>
      <TextsProvider texts={texts}><div className="list draft-list"><PlaceCard p={p} /></div></TextsProvider>
      {p.lat != null && (
        <section className="mapbox place-map" aria-label="מפה">
          <PlaceMap p={p} />
          {isApprox(p) && <div className="legend"><span>{texts['place.approx']}</span></div>}
        </section>
      )}
      <section className="draft-meta">
        <h2>פרטים שלא מוצגים בכרטיס</h2>
        <dl>
          <dt>שבת</dt><dd>{{ open: 'פתוח בשבת', closed: 'סגור בשבת', unknown: 'לא ידוע' }[p.shabbat]}</dd>
          <dt>משפחות</dt><dd>{{ yes: 'גם למשפחות', no: 'לא', unknown: 'לא ידוע' }[p.family]}</dd>
          <dt>מיקום</dt><dd>{p.lat == null ? 'אין' : `${p.precision === 'exact' ? 'מדויק' : 'משוער (מרכז היישוב)'} · ${p.lat}, ${p.lng}${p.geo_source ? ' · ' + p.geo_source : ''}`}</dd>
          <dt>סוגים</dt><dd>{p.types.join(', ') || '—'}</dd>
          <dt>תגיות</dt><dd>{p.tags.join(', ') || '—'}</dd>
          <dt>שעות ומידע מעשי</dt><dd>{p.hours || '—'}</dd>
        </dl>
      </section>
    </div>
  );
}
