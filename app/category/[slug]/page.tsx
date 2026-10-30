import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATS, CAT_OF_SLUG, CAT_SLUG } from '@/lib/config';
import { CAT_HERO } from '@/lib/headers';
import { catShareImage } from '@/lib/share-image';
import { getPlaces, getTexts } from '@/lib/store';
import { INTRO_GENERIC } from '@/lib/texts';
import Collection from '@/components/Collection';

// /category/<english slug>: one page per category ("wineries in Israel")
type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => CATS.map(c => ({ slug: CAT_SLUG[c] }));

async function load(slug: string) {
  const cat = CAT_OF_SLUG[slug];
  if (!cat) return null;
  const [all, texts] = await Promise.all([getPlaces(), getTexts()]);
  const places = all.filter(p => p.cats.includes(cat));
  const lede = texts[`intro.cat.${slug}`]?.trim() || INTRO_GENERIC;
  return { total: all.length, cat, places, texts, lede };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await load((await params).slug);
  if (!d) return {};
  const names = d.places.slice(0, 6).map(p => p.name).join(', ');
  const url = `/category/${CAT_SLUG[d.cat]}`, description = `${d.lede}. ${names}`, img = catShareImage(d.cat);
  return { title: `${d.cat} בישראל | פנינים ישראליות`, description, alternates: { canonical: url }, openGraph: { title: d.cat, description, url, siteName: 'פנינים ישראליות', locale: 'he_IL', type: 'website', images: [img] }, twitter: { card: 'summary_large_image', images: [img.url] } };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const d = await load(slug);
  if (!d) notFound();
  return <Collection title={d.cat} lede={d.lede} art={CAT_HERO[d.cat]} path={`/category/${slug}`} places={d.places} texts={d.texts} total={d.total} scope={{ kind: 'cat', name: d.cat }} />;
}
