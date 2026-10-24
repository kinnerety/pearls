// Automatic geocoding (Kinneret won't place pins by hand, so this must be automatic and honest).
// Runs in GitHub Actions (.github/workflows/geocode.yml), since it needs the open internet.
//
// For every place, in order:
//   1. coordinates published by the place itself (Waze / Google Maps links, map embeds, schema.org) -> precision "exact"
//   2. a street address published by the place, geocoded with Nominatim                      -> "exact"
//   3. an OpenStreetMap feature with the place's name right next to its town                  -> "exact"
//   4. otherwise the centre of the town (from Nominatim)                                       -> "town"
// Every "exact" result must sit within a few km of the town, or it is rejected as a wrong match.
// Writes lat/lng/precision/geo_source(/address) into data/places.json and a report to data/geo_report.md.
import fs from 'fs';

const FILE = new URL('../data/places.json', import.meta.url);
const REPORT = new URL('../data/geo_report.md', import.meta.url);
const UA = 'pninim-israeliot-geocoder/1.0 (https://github.com/kinnerety/pearls)';
const places = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',').map(Number)) : null;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const inIsrael = (lat, lng) => lat > 29.4 && lat < 33.4 && lng > 34.2 && lng < 35.95;
function km(a, b) {
  const R = 6371, dLat = (b[0] - a[0]) * Math.PI / 180, dLng = (b[1] - a[1]) * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

let lastNominatim = 0;
async function nominatim(params) {
  const wait = lastNominatim + 1100 - Date.now(); if (wait > 0) await sleep(wait); // usage policy: max 1 request/second
  lastNominatim = Date.now();
  const u = new URL('https://nominatim.openstreetmap.org/search');
  for (const [k, v] of Object.entries({ format: 'jsonv2', countrycodes: 'il', 'accept-language': 'he', limit: 5, ...params })) u.searchParams.set(k, String(v));
  try {
    const r = await fetch(u, { headers: { 'User-Agent': UA } });
    if (!r.ok) { console.warn('nominatim', r.status, u.search); return []; }
    return await r.json();
  } catch (e) { console.warn('nominatim error', e.message); return []; }
}

async function getPage(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; pninim-bot/1.0)', 'Accept-Language': 'he,en' }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (!r.ok || !(r.headers.get('content-type') || '').includes('html')) return null;
    return { url: r.url, html: (await r.text()).slice(0, 3_000_000) };
  } catch { return null; }
}

const SOCIAL = /facebook\.com|instagram\.com|fb\.me|linktr\.ee|wa\.me|whatsapp/i;
const SUBPAGE = /contact|צור.?קשר|הגעה|איך.?מגיעים|דרכי.?הגעה|location|directions|find.?us|visit|about|אודות|מיקום|map/i;

function coordsIn(html) {
  const s = html.replace(/&amp;/g, '&').replace(/%2C/gi, ',');
  const out = [];
  const add = (lat, lng, how) => { lat = +lat; lng = +lng; if (inIsrael(lat, lng)) out.push({ lat, lng, how }); };
  for (const m of s.matchAll(/[?&](?:ll|q|query|center|daddr|destination|sll|cbll)=(\d{2}\.\d{3,}),\s*(\d{2}\.\d{3,})/g)) add(m[1], m[2], 'map link');
  for (const m of s.matchAll(/@(\d{2}\.\d{4,}),(\d{2}\.\d{4,})/g)) add(m[1], m[2], 'google maps');
  for (const m of s.matchAll(/!3d(\d{2}\.\d{4,})!4d(\d{2}\.\d{4,})/g)) add(m[1], m[2], 'google maps');
  for (const m of s.matchAll(/!2d(\d{2}\.\d{4,})!3d(\d{2}\.\d{4,})/g)) add(m[2], m[1], 'google maps embed');
  for (const m of s.matchAll(/"latitude"\s*:\s*"?(\d{2}\.\d{3,})"?\s*,\s*"longitude"\s*:\s*"?(\d{2}\.\d{3,})/g)) add(m[1], m[2], 'schema.org');
  for (const m of s.matchAll(/data-lat(?:itude)?="(\d{2}\.\d{3,})"[^>]*data-(?:lng|lon|longitude)="(\d{2}\.\d{3,})"/g)) add(m[1], m[2], 'map widget');
  return out;
}
function addressesIn(html) {
  const s = html.replace(/&amp;/g, '&');
  const out = new Set();
  const clean = a => { try { a = decodeURIComponent(a.replace(/\+/g, ' ')); } catch {} return a.replace(/\s+/g, ' ').trim(); };
  for (const m of s.matchAll(/google\.[a-z.]+\/maps(?:\/embed\/v1\/place)?[^"'\s]*?[?&](?:q|query|daddr|destination)=([^&"'\s]{4,120})/g)) out.add(clean(m[1]));
  for (const m of s.matchAll(/google\.[a-z.]+\/maps\/(?:place|search)\/([^/@"'\s?]{4,120})/g)) out.add(clean(m[1]));
  for (const m of s.matchAll(/waze\.com\/ul\?[^"'\s]*?q=([^&"'\s]{4,120})/g)) out.add(clean(m[1]));
  for (const m of s.matchAll(/"streetAddress"\s*:\s*"([^"]{3,120})"/g)) out.add(clean(m[1]));
  return [...out].filter(a => !/^\d{2}\.\d+,\s*\d{2}\.\d+$/.test(a));
}

const TOWN_CLASSES = new Set(['place', 'boundary']);
async function townCentre(p) {
  const prev = p.lat != null ? [p.lat, p.lng] : null;
  const town = (p.town || '').split(/[,/]| ו?ליד /)[0].trim();
  if (!town) return null;
  const res = (await nominatim({ q: town })).filter(r => TOWN_CLASSES.has(r.category || r.class));
  for (const r of res) {
    const pt = [+r.lat, +r.lon];
    if (!prev || km(pt, prev) < 35) return { lat: pt[0], lng: pt[1], src: `מרכז היישוב ${town} (OSM)` };
  }
  return null;
}

async function fromSite(p, centre) {
  if (!p.link || SOCIAL.test(p.link)) return null;
  const first = await getPage(p.link);
  if (!first) return null;
  const pages = [first];
  const base = new URL(first.url);
  const subs = new Set();
  for (const m of first.html.matchAll(/<a\b[^>]*href="([^"#]+)"[^>]*>([\s\S]{0,200}?)<\/a>/gi)) {
    if (!SUBPAGE.test(m[1] + ' ' + m[2].replace(/<[^>]+>/g, ''))) continue;
    try { const u = new URL(m[1], base); if (u.host === base.host && u.href !== first.url) subs.add(u.href); } catch {}
    if (subs.size >= 3) break;
  }
  for (const u of subs) { const pg = await getPage(u); if (pg) pages.push(pg); }
  const limit = 12;
  const near = c => !centre || km([c.lat, c.lng], [centre.lat, centre.lng]) < limit;
  for (const pg of pages) {
    const c = coordsIn(pg.html).filter(near)[0];
    if (c) return { lat: c.lat, lng: c.lng, src: `קואורדינטות מאתר המקום (${c.how})` };
  }
  for (const pg of pages) {
    for (const a of addressesIn(pg.html)) {
      const q = a.includes(p.town) ? a : `${a}, ${p.town}`;
      const r = (await nominatim({ q }))[0] || (await nominatim({ q: a }))[0];
      if (r && near({ lat: +r.lat, lng: +r.lon })) return { lat: +r.lat, lng: +r.lon, src: `כתובת מאתר המקום: ${a}`, address: a };
    }
  }
  return null;
}

async function fromOsmName(p, centre) {
  if (!centre) return null;
  const names = [...new Set([p.name, p.name.split(/ - | – |\||,|\(/)[0]].map(s => s.trim()).filter(s => s.length >= 3))];
  const d = 0.06;
  for (const n of names) {
    const res = await nominatim({ q: n, viewbox: `${centre.lng - d},${centre.lat + d},${centre.lng + d},${centre.lat - d}`, bounded: 1 });
    const hit = res.find(r => !TOWN_CLASSES.has(r.category || r.class) && !['highway', 'landuse', 'railway'].includes(r.category || r.class) && km([+r.lat, +r.lon], [centre.lat, centre.lng]) < 5);
    if (hit) return { lat: +hit.lat, lng: +hit.lon, src: `OpenStreetMap: ${hit.display_name.split(',').slice(0, 2).join(',')}` };
  }
  return null;
}

const rows = [];
for (const p of places) {
  if (ONLY && !ONLY.has(p.id)) continue;
  if (!p.region?.length) continue; // websites have no physical place
  const centre = (await townCentre(p)) || (p.lat != null ? { lat: p.lat, lng: p.lng, src: 'מיקום משוער קודם (לא נמצא ב-OSM)' } : null);
  const exact = (await fromSite(p, centre)) || (await fromOsmName(p, centre));
  const r = exact || centre;
  if (!r) { rows.push([p.id, p.name, '—', 'לא נמצא מיקום']); continue; }
  p.lat = +r.lat.toFixed(5); p.lng = +r.lng.toFixed(5);
  p.precision = exact ? 'exact' : 'town';
  p.approx = !exact;
  p.geo_source = r.src;
  if (r.address) p.address = r.address; else delete p.address;
  rows.push([p.id, p.name, p.precision, r.src]);
  console.log(p.id, p.name, p.precision, r.src);
}

fs.writeFileSync(FILE, JSON.stringify(places, null, 1) + '\n');
const ex = places.filter(p => p.precision === 'exact').length, tw = places.filter(p => p.precision === 'town').length;
fs.writeFileSync(REPORT, `# דוח מיקומים\n\nמדויק: ${ex} · ברמת יישוב: ${tw} · מתוך ${places.length}\n\n| # | מקום | דיוק | מקור |\n|---|---|---|---|\n` +
  rows.map(r => `| ${r.map(x => String(x).replace(/\|/g, '/')).join(' | ')} |`).join('\n') + '\n');
console.log(`exact ${ex}, town ${tw}`);
