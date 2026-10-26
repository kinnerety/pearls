import type { Place } from '@/lib/types';
import { CAT_ILLO, ZONE_NAMES } from '@/lib/config';
import { zonesOf } from '@/lib/filters';
import Illo from './Illo';
import CardShare from './CardShare';
import { isApprox } from '@/lib/geo';

const STAR = 'M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z';

export default function PlaceCard({ p }: { p: Place }) {
  return (
    <article className="card" data-id={p.id}>
      {p.pick && <span className="pick"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={STAR} /></svg>המלצת המערכת</span>}
      <span className="badge"><Illo k={CAT_ILLO[p.cats[0]] || 'bench'} /></span>
      <div>
        <div className="trow">
          <h3>{p.name}</h3>
          {zonesOf(p).map(z => <span key={z} className={`cat zone z${ZONE_NAMES.indexOf(z)}`}>{z}</span>)}
        </div>
        <div className="where">{p.town || ''}{p.town ? ' · ' : ''}{p.region.join(', ')}{isApprox(p) && p.lat != null && <span className="approx"> · מיקום משוער</span>}</div>
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
