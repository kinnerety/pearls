import { HERO_SVG, TITLE_LEAVES_SVG } from './art';

// The home header, or a region/category page's header with its own title, intro line and (once drawn) its own picture
export default function Hero({ title = 'פנינים ישראליות', lede = 'מקומות קטנים ומיוחדים מהמלצות של חברים', art = HERO_SVG }: { title?: string; lede?: string; art?: string }) {
  return (
    <header>
      <svg className="hero-art" viewBox="0 0 1200 440" preserveAspectRatio="xMidYMax slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: art }} />
      <div className="title">
        <svg className="leaves" viewBox="0 0 807 260" aria-hidden="true" dangerouslySetInnerHTML={{ __html: TITLE_LEAVES_SVG }} />
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
      </div>
    </header>
  );
}
