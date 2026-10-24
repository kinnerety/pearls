import { PLACES } from '@/lib/places';
import Hero from '@/components/Hero';
import Explorer from '@/components/Explorer';

export default function Home() {
  return (
    <div className="wrap">
      <Hero />
      <Explorer places={PLACES} />
    </div>
  );
}
