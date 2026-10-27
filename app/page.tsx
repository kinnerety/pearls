import type { Metadata } from 'next';
import { getPlaces, getTexts } from '@/lib/store';
import { SITE_URL, slugOf } from '@/lib/slug';
import Hero from '@/components/Hero';
import Explorer from '@/components/Explorer';
import SiteFoot from '@/components/SiteFoot';

// pninim-il.co.il is the one official address, so the backup vercel.app address doesn't count as a second site
export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function Home() {
  const [places, texts] = await Promise.all([getPlaces(), getTexts()]);
  // tells search engines and AI assistants what this page is: a site that lists these places, each with its own page
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'פנינים ישראליות', url: SITE_URL, inLanguage: 'he',
      description: 'מקומות קטנים ומיוחדים לטיול בישראל, מהמלצות של חברים' },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: 'פנינים ישראליות: מקומות קטנים ומיוחדים לטיול בישראל', numberOfItems: places.length,
      itemListElement: places.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/p/${encodeURIComponent(slugOf(p))}` })) },
  ];
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Hero />
      <Explorer places={places} texts={texts} />
      <SiteFoot label={texts['about.link']} />
    </div>
  );
}
