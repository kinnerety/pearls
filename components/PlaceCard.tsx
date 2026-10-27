import type { Place } from '@/lib/types';
import { CAT_ILLO, ZONE_NAMES } from '@/lib/config';
import { zonesOf } from '@/lib/filters';
import Link from 'next/link';
import Illo from './Illo';
import CardShare from './CardShare';
import TitleRow from './TitleRow';
import { slugOf } from '@/lib/slug';

const STAR = 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z';

export default function PlaceCard({ p }: { p: Place }) {
  return (
    <article className={p.pick ? 'card picked' : 'card'} data-id={p.id}>
      <span className="badge"><Illo k={CAT_ILLO[p.cats[0]] || 'bench'} /></span>
      {/* round "המלצת המערכת" sticker under the category icon (Kinneret, 27.10) */}
      {p.pick && (
        <span className="seal" role="img" aria-label="המלצת המערכת">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="48" />
            <text x="50" y="33">המלצת</text>
            <text x="50" y="54">המערכת</text>
            <path d={STAR} transform="translate(37.4 58) scale(1.05)" />
          </svg>
        </span>
      )}
      <div>
        <TitleRow>
          {/* the name opens the place's own page (Kinneret, 2026-10-27); a draft (id 0) has no page yet */}
          <h3>{p.id ? <Link href={`/p/${encodeURIComponent(slugOf(p))}`}>{p.name}</Link> : p.name}</h3>
          {zonesOf(p).map(z => <span key={z} className={`cat zone z${ZONE_NAMES.indexOf(z)}`}>{z}</span>)}
          <div className="where">{p.town || ''}{p.town ? ' · ' : ''}{p.region.join(', ')}</div>
        </TitleRow>
      </div>
      {/* one row of pills: the yellow families pill first (rightmost), then the green ones (Shabbat, categories) */}
      <div className="cats">
        {p.family === 'yes' && <span className="kt fam">גם למשפחות</span>}
        {p.shabbat === 'open' && <span className="kt">פתוח בשבת</span>}
        {p.cats.map(c => <span key={c} className="cat">{c}</span>)}
      </div>
      <p className="desc">{p.descr}</p>
      {p.note && <p className="note">{p.note}</p>}
      <div className="foot">
        <CardShare p={p} />
        {p.link ? <a className="go" href={p.link} target="_blank" rel="noopener">לאתר ←</a> : <span className="where">אין קישור</span>}
      </div>
    </article>
  );
}
