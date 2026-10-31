import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/slug';
import { getTexts } from '@/lib/store';
import { TextsProvider } from '@/components/TextsContext';
import { Contact } from '@/components/Forms';
import SiteFooter from '@/components/SiteFooter';
import Forms from '@/components/Forms';
import BackSign from '@/components/BackSign';

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
      <nav className="crumbs"><BackSign /></nav>
      <main id="content" className="contents">
        <h1 className="sr-only">ליצור קשר</h1>
        <TextsProvider texts={texts}><Contact texts={texts} inline /></TextsProvider>
      </main>
      <SiteFooter />
      {/* the suggest/report popups, for the footer links */}
      <Forms texts={texts} />
    </div>
  );
}
