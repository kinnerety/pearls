import type { Texts } from '@/lib/texts';
import { ACORN_BARE } from './art';

// The 404 page body (Kinneret, 30.10.2026, layout א): her heading and two lines; a pearl search (it opens the home gallery filtered
// by the words, the same search as the home page) on the left of the recommend button (Kinneret 10:36: so a visitor who typed doesn't hit the recommend button by mistake); under them a small link home
export default function NotFound({ texts }: { texts: Texts }) {
  return (
    <main className="nf" id="nf">
      <h2 className="nf-title">{texts['notfound.title']}</h2>
      <p>{texts['notfound.text'].split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</p>
      <div className="nf-row">
        <a className="recommend" href="#suggest">להמליץ על פנינה<svg className="fav" viewBox="10 3 44 61" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ACORN_BARE }} /></a>
        <form className="qbox" role="search" action="/" method="get">
          <input type="search" name="q" placeholder="חיפוש: יישוב, שם, גבינות..." aria-label="חיפוש פנינה" required />
          <button type="submit" aria-label="חיפוש"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg></button>
        </form>
      </div>
      <a className="nf-link" href="/">{texts['notfound.home']}</a>
    </main>
  );
}
