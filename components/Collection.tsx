import { SITE_URL, slugOf } from '@/lib/slug';
import type { Place } from '@/lib/types';
import type { Texts } from '@/lib/texts';
import Hero from './Hero';
import Explorer, { type Scope } from './Explorer';
import SiteFoot from './SiteFoot';

// A region or category page: its own header, the same gallery/map as the home page (minus the facet the page already fixes), and the footer
export default function Collection({ title, lede, art, path, places, texts, scope, total }:
  { title: string; lede: string; art?: string; path: string; places: Place[]; texts: Texts; scope: Scope; total: number }) {
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description: lede, url: `${SITE_URL}${path}`, inLanguage: 'he',
    isPartOf: { '@type': 'WebSite', name: 'פנינים ישראליות', url: SITE_URL },
    mainEntity: { '@type': 'ItemList', numberOfItems: places.length,
      itemListElement: places.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/p/${slugOf(p)}` })) },
  };
  return (
    <div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Hero title={title} lede={lede} art={art} />
      <Explorer places={places} texts={texts} scope={scope} total={total} />
      <SiteFoot label={texts['about.link']} />
    </div>
  );
}
