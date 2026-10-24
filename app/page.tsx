import places from '@/data/places.json';
import type { Place } from '@/lib/types';
import Hero from '@/components/Hero';
import Explorer from '@/components/Explorer';

export default function Home() {
  return (
    <div className="wrap">
      <Hero />
      <Explorer places={places as Place[]} />
    </div>
  );
}
