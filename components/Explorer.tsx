'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Place } from '@/lib/types';
import type { Texts } from '@/lib/texts';
import { CATS, CAT_ILLO, PREFS, PREF_LABEL, ZONES, ZONE_ILLO } from '@/lib/config';
import { EMPTY, FilterState, activeCount, fromSearch, hasPref, matches, toSearch } from '@/lib/filters';
import { DIVIDER_SVG } from './art';
import Illo from './Illo';
import MapHelp from './MapHelp';
import PlaceCard from './PlaceCard';
import { TextsProvider } from './TextsContext';
import CheckPopup, { checkSeen } from './CheckPopup';
import dynamic from 'next/dynamic';
import { FULL, OUTLINE, poly } from '@/lib/outline';

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <div id="map" /> });

const MOBILE = '(max-width:860px)';
const isMobile = () => typeof window !== 'undefined' && matchMedia(MOBILE).matches;

function Chip({ pressed, onClick, n, className = '', children }: { pressed: boolean; onClick: () => void; n: number | ''; className?: string; children: React.ReactNode }) {
  return <button className={('chip ' + className).trim()} aria-pressed={pressed} onClick={onClick}>{children}<span className="n">{n}</span></button>;
}

// A region or category page fixes one facet: the count names it ("12 פנינים באזור גולן") and the page offers a way back to all the pearls
// the favicon acorn on its light-blue circle (app/icon.svg)
const FAVICON_ACORN = `<circle cx="32" cy="32" r="31" fill="#DDEEF6"/><g transform="translate(32 31) scale(1.06) translate(-32 -33)"><path d="M19 31C18.5 48 26 58.5 32 59C38 58.5 45.5 48 45 31Z" fill="#FAD771"/><path d="M34 31C34.5 45 36 53 32 59C38 58.5 45.5 48 45 31Z" fill="#22333B" fill-opacity=".14"/><path d="M24.5 36C24.5 44 27 50 30 54" fill="none" stroke="#FCF0B4" stroke-width="2.6" stroke-linecap="round"/><path d="M30.5 58.3L32 61.8L33.5 58.3Z" fill="#1C4F66"/><path d="M14 31C14 20 21.5 13.5 32 13.5S50 20 50 31C50 33.5 48 35 45.5 35H18.5C16 35 14 33.5 14 31Z" fill="#1C4F66"/><path d="M19 22.5l4 4M25 18l4 4M31 16.5l4 4M37 18l4 4M43 22.5l3 3M18 29l3-3M23 29l4-4M29 29l4-4M35 29l4-4M41 29l4-4M47 28l1.5-1.5" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="1.3" stroke-linecap="round"/><path d="M31.5 14C31 9.5 32.8 6.5 36.5 5" fill="none" stroke="#1C4F66" stroke-width="3.2" stroke-linecap="round"/></g>`;
// the same acorn without the ring (the recommend button, Kinneret 28.10.2026)
const ACORN_BARE = FAVICON_ACORN.replace(/^<circle[^>]*\/>/, '');

export type Scope = { kind: 'region' | 'cat'; name: string };

function countText(n: number, active: boolean, empty: string, scope?: Scope) {
  const where = scope ? (scope.kind === 'region' ? ` באזור ${scope.name}` : ` בקטגוריה '${scope.name}'`) : '';
  if (!active) return n === 1 ? `פנינה אחת${where}` : `${n} פנינים${where}`;
  if (n > 1) return `${n} פנינים${where} שמתאימות להגדרות שבחרת`;
  if (n === 1) return `יש רק פנינה אחת${where} שמתאימה להגדרות שבחרת`;
  return empty;   // Kinneret's wording for the empty gallery (lib/texts.ts, 'empty.top')
}

// `scope`: a region page gets the places of that region and no region clouds; a category page no category chips
// `total`: how many pearls the whole site has, shown on the "לכל הפנינים" link so it reads as a way back to the home page
export default function Explorer({ places, texts, scope, total }: { places: Place[]; texts: Texts; scope?: Scope; total?: number }) {
  const hide = scope?.kind;
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

  // a fresh random order on every visit and every filter change (typing in the search keeps it);
  // the server renders the stored order, the shuffle happens after hydration
  const [rank, setRank] = useState<Map<number, number> | null>(null);
  const shuffleKey = JSON.stringify([st.regions, st.cats, st.prefs]);
  useEffect(() => {
    if (ready) setRank(new Map(places.map(p => [p.id, Math.random()])));
  }, [ready, places, shuffleKey]);
  const items = useMemo(() => {
    const out = places.filter(p => matches(p, st));
    return rank ? out.sort((a, b) => rank.get(a.id)! - rank.get(b.id)!) : out;
  }, [places, st, rank]);
  const act = activeCount(st);

  const update = (f: (s: FilterState) => FilterState) => setSt(f);
  const toggleRegion = (k: string) => update(s => ({ ...s, regions: s.regions.includes(k) ? s.regions.filter(r => r !== k) : [...s.regions, k] }));
  const togglePref = (k: string, on: boolean) => {
    update(s => ({ ...s, prefs: on ? s.prefs.filter(x => x !== k) : [...s.prefs, k] }));
    if (!on && (k === 'למשפחות' || k === 'פתוח בשבת') && !checkSeen()) popRef.current?.showModal();
  };

  // scenario picture: what you're looking for right now
  // on a region/category page the picture is the page's own icon (zone / category), Kinneret 27.10.2026
  const scopeK = scope && (scope.kind === 'cat' ? CAT_ILLO[scope.name] : ZONE_ILLO[Object.keys(ZONES).find(z => ZONES[z].includes(scope.name)) || '']);
  const nowK = !items.length ? 'shell' : scopeK ? scopeK : st.prefs.includes('המלצת המערכת') ? 'almond' : st.prefs.includes('למשפחות') ? 'hammock'
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

  const qform = (
    <form className="qbox" id="f-qform" role="search" onSubmit={e => { e.preventDefault(); document.querySelector('.bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
      <input type="search" id="f-q" placeholder="חיפוש: יישוב, שם, גבינות..." aria-label="חיפוש" value={st.q}
        onChange={e => { const q = e.target.value; update(s => ({ ...s, q: q.trim() ? q : '' })); }} />
      <button type="submit" aria-label="חיפוש"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.4" /><path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" /></svg></button>
    </form>
  );
  // back to the whole site from a region/category page (Kinneret, 27.10.2026: not "all the pearls in this region"; labelled "כל הפנינים בכל האזורים" / "...בכל הקטגוריות")
  const allLink = <a className="chip all home" href="/"><Illo k="acorn" />{scope?.kind === 'cat' ? 'כל הפנינים בכל הקטגוריות' : 'כל הפנינים בכל האזורים'}{total != null && <span className="n">{total}</span>}</a>;
  // top-left of the region panel: opens the suggest-a-pearl form (Kinneret, 27.10.2026). 28.10: the favicon acorn without its light-blue ring,
  // tilted a little and LEFT of the text, with a soft shadow so it reads on the yellow
  // (Kinneret chose option ד, 28.10: a big acorn peeking out of the button's left end). The small "אודות" link sits right of the button (option א)
  const recommend = <span className="topacts"><a className="about" href="/about">{texts['about.link']}</a><a className="recommend" href="#suggest">להמליץ על פנינה<svg className="fav" viewBox="10 3 44 61" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ACORN_BARE }} /></a></span>;
  // the region clouds: on the home page and on category pages (Kinneret, 27.10.2026: "דווקא שם זה חשוב"); a region page has no use for them
  const clouds = (
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
  );

  return (
    <TextsProvider texts={texts}>
      {scope ? <>
        {/* region/category pages (Kinneret, 27.10.2026): no "לאן מכאן" strip; the leaves sit right under the clouds (category) or the header (region) and the search box beside the view buttons */}
        {hide === 'cat' && <section className="filters" aria-label="לפי אזור"><div className="ftop end">{recommend}</div>{clouds}</section>}
      </> : <section className="filters" aria-label="לאן מכאן">
        <div className="ftop">
          <h2 className="flabel">לאן מכאן</h2>
          {qform}
          {recommend}
        </div>
        {clouds}
      </section>}

      <svg className="divider" viewBox="0 0 560 44" aria-hidden="true" dangerouslySetInnerHTML={{ __html: DIVIDER_SVG }} />

      <div className="bar">
        <div className="now">
          <span className={'blob' + (pop ? ' pop' : '')} id="now-illo">{nowK === 'shell' ? <img className="illo" src="/art/shell.png" alt="" /> : <Illo k={nowK} />}</span>
          {/* h2 so the heading order is title → count → card names (search engines and screen readers); styled like before */}
          <div><h2 className={'count' + (act ? ' long' : '')} id="count">{countText(items.length, !!act, texts['empty.top'], scope)}</h2> <span id="countnote" className="where" /></div>
        </div>
        <div className="views" role="group" aria-label="תצוגה">
          {scope && <div className="qbar">{qform}</div>}
          <button className="chip" aria-pressed={view === 'list'} onClick={() => setView('list')}>גלריית פנינים</button>
          <button className="chip mapbtn" aria-pressed={view === 'map'} onClick={() => setView('map')}>
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
            {hide !== 'cat' && <div className="grp" id="f-cat">
              <h2 className="flabel">מה יבוא טוב עכשיו</h2>
              {/* "all": pressed when no category is chosen; clicking it clears the categories and the preferences. On a region page it leads home instead */}
              {scope ? allLink : <Chip className="all" pressed={!st.cats.length} onClick={() => update(s => ({ ...s, cats: [], prefs: [] }))} n={places.filter(p => matches(p, { ...st, cats: [], prefs: [] })).length}><Illo k="acorn" />{st.regions.length === 0 ? 'כל הפנינים' : st.regions.length === 1 ? 'כל הפנינים באזור שבחרת' : 'כל הפנינים באזורים שבחרת'}</Chip>}
              {CATS.map(k => (
                <Chip key={k} pressed={st.cats.includes(k)} onClick={() => update(s => ({ ...s, cats: s.cats.includes(k) ? s.cats.filter(c => c !== k) : [...s.cats, k] }))}
                  n={places.filter(p => matches(p, st, 'cat') && p.cats.includes(k)).length}><Illo k={CAT_ILLO[k]} />{k}</Chip>
              ))}
            </div>}
            {/* a category page has no category chips, so (Kinneret, 27.10.2026) no "עוד העדפות" heading either: the home link and the three preferences side by side, the note under them */}
            <div className="grp" id="f-pref">
              {hide === 'cat' ? allLink : <h2 className="flabel">עוד העדפות</h2>}
              {hide !== 'cat' && <p className="fnote">{texts['prefs.note']}</p>}
              {PREFS.map(k => {
                const on = st.prefs.includes(k), n = places.filter(p => matches(p, st) && hasPref(p, k)).length;
                if (!n && !on) return null;
                return <Chip key={k} pressed={on} n={n} onClick={() => togglePref(k, on)}>{PREF_LABEL[k]}</Chip>;
              })}
              {hide === 'cat' && <p className="fnote under">{texts['prefs.note']}</p>}
            </div>
          </div>
        </aside>
        <div className="content">
          <div className="list" id="list">
            {items.length ? items.map(p => <PlaceCard key={p.id} p={p} />)
              : <div className="empty">
                  {/* a tortoise shell, the tortoise hidden inside; the button opens the suggest-a-pearl form (Kinneret, 27.10) */}
                  <span className="blob"><img className="illo" src="/art/shell.png" alt="" /></span>
                  <p>{texts['empty.text']}</p>
                  <a className="suggest" href="#suggest">{texts['empty.button']}</a>
                </div>}
          </div>
          <aside className="mapbox">
            <MapHelp texts={texts} />
            <MapView items={items} visible={view === 'map'} />
            <div className="legend">
              {/* the same badge as on the map markers: a yellow circle with a black star */}
              <span className="legend-pick"><i className="pk"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z" /></svg></i>המלצת המערכת</span>
            </div>
          </aside>
        </div>
      </div>
      <CheckPopup ref={popRef} texts={texts} />
    </TextsProvider>
  );
}
