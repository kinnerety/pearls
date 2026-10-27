import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/lib/slug';
import { getTexts } from '@/lib/store';
import { parseAbout, plainText } from '@/lib/texts';
import { DIVIDER_SVG } from '@/components/art';
import Rich, { Paras } from '@/components/Rich';

export const metadata: Metadata = {
  title: 'אודות | פנינים ישראליות',
  description: 'איך נולדו פנינים ישראליות: רשימה של מקומות קטנים ומיוחדים לטיול בישראל, מהמלצות של חברים, שכנרת יפרח אספה למשפחה שבאה לבקר.',
  alternates: { canonical: '/about' },
};

// Kinneret's own text and pictures (27.10.2026); every text on the page is edited in /admin/texts ("about.*")
export default async function About() {
  const texts = await getTexts();
  const blocks = parseAbout(texts['about.main']);
  // each question with the paragraphs after it, for the FAQ structured data
  const faq: { q: string; a: string }[] = [];
  for (const b of blocks) {
    if (b.kind === 'q') faq.push({ q: plainText(b.text), a: '' });
    else if (b.kind === 'h2') { if (faq.length) break; }
    else if (faq.length) faq[faq.length - 1].a = (faq[faq.length - 1].a + ' ' + plainText(b.text)).trim();
  }
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'AboutPage', name: plainText(texts['about.h1']), url: `${SITE_URL}/about`, inLanguage: 'he',
      isPartOf: { '@type': 'WebSite', name: 'פנינים ישראליות', url: SITE_URL }, author: { '@type': 'Person', name: 'כנרת יפרח' } },
    ...(faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.filter(f => f.a).map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
  ];
  return (
    <div className="wrap place-page about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <nav className="crumbs"><Link href="/" className="sign"><span>לכל הפנינים</span></Link></nav>
      <article className="place about">
        <h1><Rich text={texts['about.h1']} /></h1>

        {/* side by side on a wide screen, Kinneret first; one under the other on a phone */}
        <div className="about-people">
          <figure>
            <img src="/about/kinneret.jpg" width={600} height={600} alt="איור של כנרת יפרח" />
            <figcaption><Paras text={texts['about.me']} /></figcaption>
          </figure>
          <figure>
            <img src="/about/matti.jpg" width={600} height={600} alt="איור של מתי" />
            <figcaption><Paras text={texts['about.matti']} /></figcaption>
          </figure>
        </div>

        <Paras text={texts['about.story']} />

        {/* the Facebook post, as live text in a Facebook-like card */}
        <div className="fb-post">
          <div className="fb-head">
            <img src="/about/kinneret.jpg" width={40} height={40} alt="" />
            <div>
              <b>{texts['about.post.name']}</b>
              <span>{texts['about.post.date']} · <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13" fill="none" stroke="currentColor" strokeWidth="1.1" /></svg></span>
            </div>
            <span className="fb-dots" aria-hidden="true">•••</span>
          </div>
          <div className="fb-body"><Paras text={texts['about.post']} /></div>
          <div className="fb-foot" aria-hidden="true">
            <span><svg viewBox="0 0 24 24" width="20" height="20"><path d="M7 10v10H4V10h3Zm2 10V10l4-7c1.4 0 2.3 1 2 2.4L14.4 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H9Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>91</span>
            <span><svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 4c4.7 0 8.5 3.2 8.5 7.3S16.7 18.6 12 18.6c-1 0-2-.1-2.9-.4L5 20l1-3.6c-1.6-1.3-2.5-3.1-2.5-5.1C3.5 7.2 7.3 4 12 4Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>239</span>
            <span className="fb-reacts"><i className="r-like">👍</i><i className="r-love">❤</i></span>
          </div>
        </div>

        <Paras text={texts['about.trip']} />
        <figure className="about-art">
          <img src="/about/rish-lakish.jpg" width={1400} height={933} alt="איור: יוני, אלן ומתי טועמים שמן זית בריש לקיש, יחד עם רחל נוי מאיר" />
        </figure>

        <Paras text={texts['about.list']} />
        <a className="list-card" href="/about/original-list.jpg" target="_blank" rel="noopener">
          <img src="/about/original-list.jpg" width={928} height={748} alt="צילום מסך של הרשימה המקורית: טבלה עם שמות המקומות, יישוב, אזור, סוג וקישור" />
        </a>

        {blocks.map((b, i) => b.kind === 'h2'
          ? <h2 key={i}><Rich text={b.text} /></h2>
          : b.kind === 'q' ? <h3 key={i}><Rich text={b.text} /></h3> : <p key={i}><Rich text={b.text} /></p>)}
      </article>
      <svg className="divider" viewBox="0 0 560 44" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DIVIDER_SVG }} />
    </div>
  );
}
