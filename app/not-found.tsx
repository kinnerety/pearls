import type { Metadata } from 'next';
import { getTexts } from '@/lib/store';
import Hero from '@/components/Hero';
import NotFound from '@/components/NotFound';
import SiteFoot from '@/components/SiteFoot';
import Forms from '@/components/Forms';

export const metadata: Metadata = { title: 'העמוד לא נמצא | פנינים ישראליות', robots: { index: false } };

// Any address the site doesn't know (Kinneret, 30.10.2026): the home header, her two lines, a pearl search, the recommend button and a way home
export default async function NotFoundPage() {
  const texts = await getTexts();
  return (
    <div className="wrap">
      <Hero />
      <NotFound texts={texts} />
      <SiteFoot label={texts['about.link']} />
      {/* the suggest-a-pearl popup, opened by the recommend button */}
      <Forms texts={texts} />
    </div>
  );
}
