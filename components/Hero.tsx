import { HERO_SVG, TITLE_LEAVES_SVG } from './art';

// The home header, or a region/category page's header with its own title, intro line and (once drawn) its own picture
// motion (Kinneret, 27.10.2026): the title leaves are on the home page only; region pages move only their picture's element (clouds, helicopter, birds, ibex); category pages stay still
export default function Hero({ title = 'פנינים ישראליות', lede = 'מקומות קטנים ומיוחדים מהמלצות של חברים', art = HERO_SVG, motion = 'all' }: { title?: string; lede?: string; art?: string; motion?: 'all' | 'art' | 'none' }) {
  const cls = [title.length > 20 ? 'long2' : title.length > 15 ? 'long' : '', motion === 'none' ? 'still-art' : ''].filter(Boolean).join(' ');
  return (
    <header className={cls || undefined}>
      <svg className="hero-art" viewBox="0 0 1200 440" preserveAspectRatio="xMidYMax slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: art }} />
      <div className="title">
        {motion === 'all' && <svg className="leaves" viewBox="0 0 807 260" aria-hidden="true" dangerouslySetInnerHTML={{ __html: TITLE_LEAVES_SVG }} />}
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
      </div>
    </header>
  );
}
