import { HERO_SVG } from './art';

export default function Hero() {
  return (
    <header>
      <svg className="hero-art" viewBox="0 0 1200 440" preserveAspectRatio="xMidYMax slice" aria-hidden="true" dangerouslySetInnerHTML={{ __html: HERO_SVG }} />
      <div className="title">
        <h1>פנינים ישראליות</h1>
        <p className="lede">מקומות קטנים ומיוחדים מהמלצות של חברים</p>
      </div>
    </header>
  );
}
