import { getPlaces } from '@/lib/store';
import Hero from '@/components/Hero';
import Explorer from '@/components/Explorer';

export default async function Home() {
  const places = await getPlaces();
  return (
    <div className="wrap">
      <Hero />
      <Explorer places={places} />
    </div>
  );
}
