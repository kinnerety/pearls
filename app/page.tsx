import type { Metadata } from 'next';
import { getPlaces, getTexts } from '@/lib/store';
import { SITE_DESCRIPTION, SITE_URL, slugOf } from '@/lib/slug';
import { CATS, CAT_SLUG, REGIONS, REGION_SLUG } from '@/lib/config';
import Hero from '@/components/Hero';
import Explorer from '@/components/Explorer';
import SiteFoot from '@/components/SiteFoot';
import Forms from '@/components/Forms';

// pninim-il.co.il is the one official address, so the backup vercel.app address doesn't count as a second site
export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function Home() {
  const [places, texts] = await Promise.all([getPlaces(), getTexts()]);
  // tells search engines and AI assistants what this site is (Kinneret's description, who is behind it, its region and
  // category pages) and what this page lists: every place, each with its own page. Hidden in the page's code; visitors never see it.
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'פנינים ישראליות', url: SITE_URL, inLanguage: 'he',
      description: SITE_DESCRIPTION,
      author: { '@type': 'Person', name: 'כנרת יפרח', url: `${SITE_URL}/about`, sameAs: ['http://www.drafttt.co.il'],
        description: 'כותבת בדראפט, חובבת מסלולים מישוריים ומעגליים שלאורכם נחל ובסופם עגלת קפה' },
      hasPart: [
        ...REGIONS.map(r => ({ '@type': 'CollectionPage', name: `פנינים ב${r}`, url: `${SITE_URL}/region/${REGION_SLUG[r]}` })),
        ...CATS.map(c => ({ '@type': 'CollectionPage', name: c, url: `${SITE_URL}/category/${CAT_SLUG[c]}` })),
      ] },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: 'פנינים ישראליות: מקומות קטנים ומיוחדים לטיול בישראל', numberOfItems: places.length,
      itemListElement: places.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/p/${encodeURIComponent(slugOf(p))}` })) },
  ];
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Hero />
      <main id="content" className="contents"><Explorer places={places} texts={texts} /></main>
      <SiteFoot index />
      {/* the suggest-a-pearl popup, opened by the button of the empty gallery */}
      <Forms texts={texts} />
    </div>
  );
}
