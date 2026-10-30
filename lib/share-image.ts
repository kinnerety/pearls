// The picture WhatsApp, Facebook, Telegram and iMessage show next to a shared link (og:image): the icon of the pearl's main
// category (or of a region cloud) on a white paper cutout, rendered to public/share/ by scripts/share-images.cjs. 1200×630, under 300 KB.
// (Kinneret, 30.10.2026: the icon, not the page header.)
import { CAT_SLUG } from './config';

export const ZONE_SHARE: Record<string, string> = { 'צפון': 'north', 'מרכז': 'center', 'ירושלים והאזור': 'jerusalem', 'דרום': 'south' };

const image = (file: string, alt: string) => ({ url: `/share/${file}.jpg`, width: 1200, height: 630, alt });
/** the picture for a category (anything unknown = the "אתרי אינטרנט" picture) */
export const catShareImage = (cat?: string) => image(`cat-${(cat && CAT_SLUG[cat]) || 'websites'}`, cat || 'פנינים ישראליות');
/** the picture for a region cloud */
export const zoneShareImage = (zone?: string) => zone && ZONE_SHARE[zone] ? image(`zone-${ZONE_SHARE[zone]}`, zone) : catShareImage();
