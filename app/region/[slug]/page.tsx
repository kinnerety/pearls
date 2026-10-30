import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { REGIONS, REGION_OF_SLUG, REGION_SLUG, zoneOf } from '@/lib/config';
import { ZONE_HERO } from '@/lib/headers';
import { zoneShareImage } from '@/lib/share-image';
import { getPlaces, getTexts } from '@/lib/store';
import { INTRO_GENERIC } from '@/lib/texts';
import Collection from '@/components/Collection';

// /region/<english slug>: one page per small region, so search engines and AI assistants can answer "what to see in the Golan"
type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => REGIONS.map(r => ({ slug: REGION_SLUG[r] }));

async function load(slug: string) {
  const region = REGION_OF_SLUG[slug];
  if (!region) return null;
  const [all, texts] = await Promise.all([getPlaces(), getTexts()]);
  const places = all.filter(p => p.region.includes(region));
  const lede = texts[`intro.region.${slug}`]?.trim() || INTRO_GENERIC;
  return { total: all.length, region, places, texts, lede, title: `פנינים ב${region}` };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await load((await params).slug);
  if (!d) return {};
  const names = d.places.slice(0, 6).map(p => p.name).join(', ');
  const url = `/region/${REGION_SLUG[d.region]}`, description = `${d.lede}. ${names}`, img = zoneShareImage(zoneOf(d.region));
  return { title: `${d.title} | פנינים ישראליות`, description, alternates: { canonical: url }, openGraph: { title: d.title, description, url, siteName: 'פנינים ישראליות', locale: 'he_IL', type: 'website', images: [img] }, twitter: { card: 'summary_large_image', images: [img.url] } };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const d = await load(slug);
  if (!d) notFound();
  return <Collection title={d.title} lede={d.lede} art={ZONE_HERO[zoneOf(d.region) || '']} path={`/region/${slug}`} places={d.places} texts={d.texts} total={d.total} scope={{ kind: 'region', name: d.region }} />;
}
