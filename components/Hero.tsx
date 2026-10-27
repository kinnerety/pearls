import { HERO_SVG, TITLE_LEAVES_SVG } from './art';

export default function Hero() {
  return (
    <header>
      <svg className="hero-art" viewBox="0 0 1200 440" preserveAspectRatio="xMidYMax slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: HERO_SVG }} />
      <div className="title">
        <svg className="leaves" viewBox="0 0 807 260" aria-hidden="true" dangerouslySetInnerHTML={{ __html: TITLE_LEAVES_SVG }} />
        <h1>פנינים ישראליות</h1>
        <p className="lede">מקומות קטנים ומיוחדים מהמלצות של חברים</p>
      </div>
    </header>
  );
}
