import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/slug';
import { getTexts } from '@/lib/store';
import { parseAbout } from '@/lib/texts';
import { DIVIDER_SVG } from '@/components/art';

export const metadata: Metadata = {
  title: 'על האתר | פנינים ישראליות',
  description: 'איך נולדו פנינים ישראליות: רשימה של מקומות קטנים ומיוחדים לטיול בישראל, מהמלצות של חברים, שכנרת יפרח אספה למשפחה שבאה לבקר.',
  alternates: { canonical: '/about' },
};

// Kinneret's story + questions and answers; the text is edited in /admin/texts ("about.body")
export default async function About() {
  const texts = await getTexts();
  const blocks = parseAbout(texts['about.body']);
  // each question with the paragraphs after it, for the FAQ structured data
  const faq: { q: string; a: string }[] = [];
  for (const b of blocks) {
    if (b.kind === 'q') faq.push({ q: b.text, a: '' });
    else if (b.kind === 'h2') { if (faq.length) break; }
    else if (faq.length) faq[faq.length - 1].a = (faq[faq.length - 1].a + ' ' + b.text).trim();
  }
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'AboutPage', name: texts['about.title'], url: `${SITE_URL}/about`, inLanguage: 'he',
      isPartOf: { '@type': 'WebSite', name: 'פנינים ישראליות', url: SITE_URL }, author: { '@type': 'Person', name: 'כנרת יפרח' } },
    ...(faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.filter(f => f.a).map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
  ];
  return (
    <div className="wrap place-page about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <nav className="crumbs"><Link href="/" className="sign"><span>לכל הפנינים</span></Link></nav>
      <article className="place about">
        <h1>{texts['about.title']}</h1>
        <img className="about-art" src="/about/meeting.svg" width={900} height={600} alt="איור: ארבעה חברים צוחקים סביב שולחן עם בקבוקי שמן זית, בחנות קטנה עם קירות אדמה" />
        <img className="about-me" src="/about/kinneret.jpg" width={600} height={600} alt="איור של כנרת יפרח" />
        {blocks.map((b, i) => b.kind === 'h2'
          ? <h2 key={i}>{b.text}</h2>
          : b.kind === 'q' ? <h3 key={i}>{b.text}</h3> : <p key={i}>{b.text}</p>)}
      </article>
      <svg className="divider" viewBox="0 0 560 44" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DIVIDER_SVG }} />
    </div>
  );
}
