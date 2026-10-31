import type { Metadata } from 'next';
import { Fragment } from 'react';
import { SITE_URL } from '@/lib/slug';
import { getTexts } from '@/lib/store';
import { parseAbout } from '@/lib/texts';
import Rich from '@/components/Rich';
import Forms from '@/components/Forms';
import SiteFooter from '@/components/SiteFooter';
import BackSign from '@/components/BackSign';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | פנינים ישראליות',
  description: 'הצהרת הנגישות של פנינים ישראליות: מה הונגש באתר, איך זה נבדק, מגבלות ידועות ואיך פונים בנושא נגישות.',
  alternates: { canonical: '/accessibility' },
};

// The accessibility statement (30.10.2026): every text is edited in /admin/accessibility ("a11y.*"); "## " lines are the section headings
export default async function Accessibility() {
  const texts = await getTexts();
  const blocks = parseAbout(texts['a11y.main']);
  const jsonLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: texts['a11y.title'], url: `${SITE_URL}/accessibility`, inLanguage: 'he',
    isPartOf: { '@type': 'WebSite', name: 'פנינים ישראליות', url: SITE_URL } };
  return (
    <div className="wrap place-page a11y-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <nav className="crumbs"><BackSign /></nav>
      <main id="content" className="contents">
        <article className="place about">
          <h1>{texts['a11y.title']}</h1>
          <p className="date">{texts['a11y.date']}</p>
          {blocks.map((b, i) => <Fragment key={i}>{b.kind === 'h2' ? <h2><Rich text={b.text} /></h2> : <p><Rich text={b.text} /></p>}</Fragment>)}
        </article>
      </main>
      <SiteFooter />
      {/* "טופס יצירת הקשר" in the text opens the contact popup */}
      <Forms texts={texts} />
    </div>
  );
}
