import { getPlaces, getTexts } from '@/lib/store';
import Hero from '@/components/Hero';
import Explorer from '@/components/Explorer';

export default async function Home() {
  const [places, texts] = await Promise.all([getPlaces(), getTexts()]);
  return (
    <div className="wrap">
      <Hero />
      <Explorer places={places} texts={texts} />
    </div>
  );
}
