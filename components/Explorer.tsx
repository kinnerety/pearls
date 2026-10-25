'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '@/lib/types';
import { CATS, CAT_ILLO, PREFS, PREF_LABEL, ZONES, ZONE_ILLO } from '@/lib/config';
import { EMPTY, FilterState, activeCount, fromSearch, hasPref, matches, toSearch } from '@/lib/filters';
import { DIVIDER_SVG } from './art';
import Illo from './Illo';
import PlaceCard from './PlaceCard';
import CheckPopup, { checkSeen } from './CheckPopup';
import dynamic from 'next/dynamic';
import { FULL, OUTLINE, poly } from '@/lib/outline';

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div id="map" /> });

const MOBILE = '(max-width:860px)';
const isMobile = () => typeof window !== 'undefined' && matchMedia(MOBILE).matches;

function Chip({ pressed, onClick, n, className = '', children }: { pressed: boolean; onClick: () => void; n: number | ''; className?: string; children: React.ReactNode }) {
  return <button className={('chip ' + className).trim()} aria-pressed={pressed} onClick={onClick}>{children}<span className="n">{n}</span></button>;
}

function countText(n: number, active: boolean) {
  if (!active) return `${n} פנינים`;
  if (n > 1) return `${n} פנינים שמתאימות להגדרות שבחרת`;
  if (n === 1) return 'יש רק פנינה אחת שמתאימה להגדרות שבחרת';
  return 'אין כאן פנינים שמתאימות להגדרות שבחרת, אבל זה לא אומר שאין כאלה בארץ :)';
}

export default function Explorer({ places }: { places: Place[] }) {
  const [st, setSt] = useState<FilterState>(EMPTY);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [panel, setPanel] = useState<'open' | 'closed'>('open');
  const [sideH, setSideH] = useState<string | undefined>();
  const popRef = useRef<HTMLDialogElement>(null);
  const sideRef = useRef<HTMLElement>(null);

  // filters come from (and go back to) the URL, so a filtered view can be shared
  const viewOf = (search: string) => (new URLSearchParams(search).get('v') === 'map' ? 'map' : 'list');
  useEffect(() => {
    setSt(fromSearch(location.search));
    setView(viewOf(location.search));
    if (isMobile()) setPanel('closed');
    setReady(true);
    const onPop = () => { setSt(fromSearch(location.search)); setView(viewOf(location.search)); };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const s = toSearch(st) + (view === 'map' ? (toSearch(st) ? '&' : '?') + 'v=map' : '');
    if (s !== location.search) history.replaceState(null, '', location.pathname + s);
  }, [st, view, ready]);

  const items = useMemo(() => places.filter(p => matches(p, st)), [places, st]);
  const act = activeCount(st);

  const update = (f: (s: FilterState) => FilterState) => setSt(f);
  const toggleRegion = (k: string) => update(s => ({ ...s, regions: s.regions.includes(k) ? s.regions.filter(r => r !== k) : [...s.regions, k] }));
  const togglePref = (k: string, on: boolean) => {
    update(s => ({ ...s, prefs: on ? s.prefs.filter(x => x !== k) : [...s.prefs, k] }));
    if (!on && (k === 'למשפחות' || k === 'פתוח בשבת') && !checkSeen()) popRef.current?.showModal();
  };

  // scenario picture: what you're looking for right now
  const nowK = !items.length ? 'hedgehog' : st.prefs.includes('המלצת המערכת') ? 'almond' : st.prefs.includes('למשפחות') ? 'hammock'
    : st.prefs.includes('פתוח בשבת') ? 'table' : st.cats.length ? CAT_ILLO[st.cats[0]]
    : st.regions.length === 1 ? ZONE_ILLO[Object.keys(ZONES).find(z => ZONES[z].includes(st.regions[0]))!] : st.q ? 'trail' : 'bench';
  const [pop, setPop] = useState(false);
  const firstNow = useRef(true);
  useEffect(() => {
    if (firstNow.current) { firstNow.current = false; return; }
    setPop(true); const t = setTimeout(() => setPop(false), 300); return () => clearTimeout(t);
  }, [nowK]);

  const toggleFold = () => {
    if (panel === 'open' && sideRef.current && sideRef.current.offsetHeight > 100) setSideH(sideRef.current.offsetHeight + 'px');
    setPanel(panel === 'open' ? 'closed' : 'open');
  };

  const open = panel === 'open';

  return (
    <>
      <section className="filters" aria-label="לאן מכאן">
        <div className="ftop">
          <span className="flabel">לאן מכאן</span>
          <form className="qbox" id="f-qform" role="search" onSubmit={e => { e.preventDefault(); document.querySelector('.bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
            <input type="search" id="f-q" placeholder="חיפוש: יישוב, שם, גבינות..." aria-label="חיפוש" value={st.q}
              onChange={e => { const q = e.target.value; update(s => ({ ...s, q: q.trim() ? q : '' })); }} />
            <button type="submit" aria-label="חיפוש"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg></button>
          </form>
        </div>
        <div className="clouds" id="f-region">
          {Object.keys(ZONES).map((g, gi) => (
            <div className="cloud" key={g}>
              <span className="gname"><Illo k={ZONE_ILLO[g]} />{g}</span>
              {ZONES[g].map(k => (
                <Chip key={k} className="sm" pressed={st.regions.includes(k)} onClick={() => toggleRegion(k)}
                  n={places.filter(p => matches(p, st, 'region') && p.region.includes(k)).length}>{k}</Chip>
              ))}
              {gi === 0 && st.regions.length > 0 && <Chip className="sm clear" pressed={false} n="" onClick={() => update(s => ({ ...s, regions: [] }))}>נקה בחירה</Chip>}
            </div>
          ))}
        </div>
      </section>

      <svg className="divider" viewBox="0 0 560 44" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DIVIDER_SVG }} />

      <div className="bar">
        <span className="now">
          <span className={'blob' + (pop ? ' pop' : '')} id="now-illo"><Illo k={nowK} /></span>
          <span><span className={'count' + (act ? ' long' : '')} id="count">{countText(items.length, !!act)}</span> <span id="countnote" className="where" /></span>
        </span>
        <div className="views" role="group" aria-label="תצוגה">
          <button className="chip" aria-pressed={view === 'list'} onClick={() => setView('list')}>גלריית פנינים</button>
          <button className="chip" aria-pressed={view === 'map'} onClick={() => setView('map')}>
            על המפה<svg className="il" viewBox={FULL.join(' ')} aria-hidden="true"><polygon points={poly(OUTLINE)} /></svg>
          </button>
        </div>
      </div>

      <div className="main" id="main" data-view={view} data-panel={panel}
        style={sideH ? ({ '--sideH': sideH } as React.CSSProperties) : undefined}>
        <aside className="side" aria-label="סינונים" ref={sideRef}>
          <button className="fold" id="fold" aria-expanded={open} aria-label={open ? 'סגירת פאנל הסינון' : 'פתיחת פאנל הסינון'} title={open ? 'סגירת הסינון' : 'פתיחת הסינון'} onClick={toggleFold}>
            {/* beside the map (wide screens): a side-panel icon; above it (narrow screens): a chevron pointing where the panel will go */}
            <svg className="ico-side" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M15 4v16" stroke="currentColor" strokeWidth="1.8" /><path d={open ? 'M8 9.5l2.5 2.5L8 14.5' : 'M10.5 9.5L8 12l2.5 2.5'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <svg className="ico-top" viewBox="0 0 24 24" aria-hidden="true"><path d={open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="lbl">סינונים</span>
            {act > 0 && !open && <span className="on">{act}</span>}
          </button>
          <div className="body">
            <div className="grp" id="f-cat">
              <span className="flabel">מה יבוא טוב עכשיו</span>
              {/* "all": pressed when no category is chosen; clicking it clears the categories and the preferences */}
              <Chip className="all" pressed={!st.cats.length} onClick={() => update(s => ({ ...s, cats: [], prefs: [] }))} n={places.filter(p => matches(p, { ...st, cats: [], prefs: [] })).length}><Illo k="acorn" />{st.regions.length === 0 ? 'כל הפנינים' : st.regions.length === 1 ? 'כל הפנינים באזור שבחרת' : 'כל הפנינים באזורים שבחרת'}</Chip>
              {CATS.map(k => (
                <Chip key={k} pressed={st.cats.includes(k)} onClick={() => update(s => ({ ...s, cats: s.cats.includes(k) ? s.cats.filter(c => c !== k) : [...s.cats, k] }))}
                  n={places.filter(p => matches(p, st, 'cat') && p.cats.includes(k)).length}><Illo k={CAT_ILLO[k]} />{k}</Chip>
              ))}
            </div>
            <div className="grp" id="f-pref">
              <span className="flabel">עוד העדפות</span>
              <p className="fnote">יכול להיות שיש עוד פנינים שמתאימות למשפחות או פתוחות בשבת ולא סווגו ככאלה, ולהפך</p>
              {PREFS.map(k => {
                const on = st.prefs.includes(k), n = places.filter(p => matches(p, st) && hasPref(p, k)).length;
                if (!n && !on) return null;
                return <Chip key={k} pressed={on} n={n} onClick={() => togglePref(k, on)}>{PREF_LABEL[k]}</Chip>;
              })}
            </div>
          </div>
        </aside>
        <div className="content">
          <div className="list" id="list">
            {items.length ? items.map(p => <PlaceCard key={p.id} p={p} />)
              : <div className="empty"><span className="blob"><Illo k="hedgehog" /></span>אין פנינים שמתאימות לכל הסינונים. נסו להסיר אחד מהם.</div>}
          </div>
          <aside className="mapbox">
            <MapView items={items} visible={view === 'map'} />
            <div className="legend">
              <span className="hover-hint">ריחוף על סמן פותח את הכרטיס, לחיצה משאירה אותו פתוח</span>
              <span className="touch-hint">נגיעה בסמן פותחת את הכרטיס</span>
              <span><svg viewBox="-1.2 -1.2 2.4 2.4" width="12" height="12" style={{ verticalAlign: '-1px', marginInlineEnd: 4 }}><polygon points="0,-1 0.26,-0.36 0.95,-0.31 0.43,0.14 0.59,0.81 0,0.45 -0.59,0.81 -0.43,0.14 -0.95,-0.31 -0.26,-0.36" fill="#F3E27C" stroke="#22333B" strokeWidth=".15" /></svg>המלצת המערכת</span>
            </div>
          </aside>
        </div>
      </div>
      <CheckPopup ref={popRef} />
    </>
  );
}
