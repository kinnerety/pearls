import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { CAT_ILLO, ZONE_NAMES } from '@/lib/config';
import { zonesOf } from '@/lib/filters';
import { SITE_URL, idOfSlug, slugOf } from '@/lib/slug';
import { getPlace, getPlaces, getTexts } from '@/lib/store';
import { DIVIDER_SVG } from '@/components/art';
import Illo from '@/components/Illo';
import PlaceCard from '@/components/PlaceCard';
import PlaceMap from '@/components/PlaceMap';
import ShareButton from '@/components/ShareButton';
import { TextsProvider } from '@/components/TextsContext';
import { isApprox } from '@/lib/geo';

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = async () => (await getPlaces()).map(p => ({ slug: slugOf(p) }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPlace(idOfSlug((await params).slug));
  if (!p) return {};
  const title = `${p.name}${p.town ? ' · ' + p.town : ''}`;
  const description = p.descr.length > 160 ? p.descr.slice(0, 157) + '…' : p.descr;
  const url = `/p/${slugOf(p)}`;
  return {
    title: `${title} | פנינים ישראליות`, description,
    alternates: { canonical: url },
    // the category's picture is what WhatsApp & co. show next to a shared link
    openGraph: { title, description, url, siteName: 'פנינים ישראליות', locale: 'he_IL', type: 'article', images: [{ url: `/share/${CAT_ILLO[p.cats[0]] || 'valley'}.jpg`, width: 1080, height: 1080, alt: p.cats[0] }] },
    twitter: { card: 'summary_large_image', title, description, images: [`/share/${CAT_ILLO[p.cats[0]] || 'valley'}.jpg`] },
  };
}

export default async function PlacePage({ params }: Props) {
  const { slug } = await params;
  const p = await getPlace(idOfSlug(slug));
  if (!p) notFound();
  if (decodeURIComponent(slug) !== slugOf(p)) permanentRedirect(`/p/${encodeURIComponent(slugOf(p))}`);

  const texts = await getTexts();
  const near = (await getPlaces()).filter(o => o.id !== p.id && o.region.some(r => p.region.includes(r))).slice(0, 6);
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'TouristAttraction', name: p.name, description: p.descr,
    url: `${SITE_URL}/p/${slugOf(p)}`, ...(p.link ? { sameAs: p.link } : {}),
    address: { '@type': 'PostalAddress', addressLocality: p.town, addressCountry: 'IL', ...(p.address ? { streetAddress: p.address } : {}) },
    ...(p.lat != null && !isApprox(p) ? { geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng } } : {}),
  };

  return (
    <div className="wrap place-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      {/* a wooden signpost pointing back to all the pearls (Kinneret, 2026-10-26: no site title on this page) */}
      <nav className="crumbs"><Link href="/" className="sign"><span>לכל הפנינים</span></Link></nav>
      <article className="place">
        {p.pick && <span className="pick"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" /></svg>המלצת המערכת</span>}
        <span className="badge"><Illo k={CAT_ILLO[p.cats[0]] || 'bench'} /></span>
        <div className="cats">
          {p.family === 'yes' && <span className="kt fam">גם למשפחות</span>}
          {p.shabbat === 'open' && <span className="kt">פתוח בשבת</span>}
        </div>
        <h1>{p.name}</h1>
        <div className="where">
          {p.town || ''}{p.town ? ' · ' : ''}{p.region.join(', ')}
          {zonesOf(p).map(z => <span key={z} className={`cat zone z${ZONE_NAMES.indexOf(z)}`}>{z}</span>)}
        </div>
        <div className="cats">{p.cats.map(c => <Link key={c} href={`/?cat=${encodeURIComponent(c)}`} className="cat">{c}</Link>)}</div>
        <p className="lead">{p.descr}</p>
        {p.note && <p className="note">{p.note}</p>}
        <p className="check">{texts['place.check']}</p>
        <div className="actions">
          {/* share on the right, the site link on the left, no Waze (Kinneret, 2026-10-26: locations are often town-level) */}
          <ShareButton title={p.name} text={`${p.name}${p.town ? ' ב' + p.town : ''} · פנינים ישראליות`} />
          {p.link && <a className="go" href={p.link} target="_blank" rel="noopener">לאתר ←</a>}
        </div>
      </article>
      {p.lat != null && (
        <section className="mapbox place-map" aria-label="מפה">
          <PlaceMap p={p} />
          {isApprox(p) && <div className="legend"><span>{texts['place.approx']}</span></div>}
        </section>
      )}
      {near.length > 0 && (
        <section className="near">
          <svg className="divider" viewBox="0 0 560 44" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DIVIDER_SVG }} />
          <h2>עוד באזור</h2>
          <TextsProvider texts={texts}><div className="list">{near.map(o => <PlaceCard key={o.id} p={o} />)}</div></TextsProvider>
        </section>
      )}
    </div>
  );
}
