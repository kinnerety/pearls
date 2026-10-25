import type { Place } from './types';

// "exact" = address or coordinates published by the place; anything else is the town centre
export const isApprox = (p: Place) => (p.precision ? p.precision !== 'exact' : p.approx);

// OpenStreetMap's own tiles: free, no key, Hebrew labels in Israel. (CARTO started answering with an "API key required" tile.)
export const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// Google Maps (Hebrew labels, no Arabic): browser key set in Vercel, restricted to the site's domains in Google Cloud
export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '';

// Waze: exact pins navigate to the point; town-level places navigate to the town by name (more honest than a fake pin)
export const wazeUrl = (p: Place) =>
  !isApprox(p) && p.lat != null ? `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`
  : p.town ? `https://waze.com/ul?q=${encodeURIComponent(p.town)}&navigate=yes`
  : p.lat != null ? `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes` : '';
