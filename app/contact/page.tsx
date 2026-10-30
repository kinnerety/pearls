import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/slug';
import { getTexts } from '@/lib/store';
import { TextsProvider } from '@/components/TextsContext';
import { Contact } from '@/components/Forms';
import SiteFoot from '@/components/SiteFoot';

export const metadata: Metadata = {
  title: 'ליצור קשר | פנינים ישראליות',
  description: 'טופס יצירת קשר עם פנינים ישראליות: המלצה על פנינה, דיווח על טעות באתר, שאלה על פנינה או משהו אחר.',
  alternates: { canonical: '/contact' },
};

// The contact form on a page of its own (Kinneret, 30.10.2026); on the other pages the same form opens as a popup (#contact)
export default async function ContactPage() {
  const texts = await getTexts();
  const jsonLd = { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'ליצור קשר', url: `${SITE_URL}/contact`, inLanguage: 'he',
    isPartOf: { '@type': 'WebSite', name: 'פנינים ישראליות', url: SITE_URL } };
  return (
    <div className="wrap place-page contact">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <nav className="crumbs"><Link href="/" className="sign"><span>לכל הפנינים</span></Link></nav>
      <TextsProvider texts={texts}><Contact texts={texts} inline /></TextsProvider>
      <SiteFoot label={texts['about.link']} />
    </div>
  );
}
