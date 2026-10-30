import { NextRequest, NextResponse } from 'next/server';

// An AI agent that asks for a page as text (Accept: text/markdown, and not HTML first) gets Markdown in two cases only
// (Kinneret, 30.10.2026): the home page (the llms.txt guide) and an address the site doesn't know (a 404 in Markdown).
// Every real page (about, contact, pearls, regions, categories) stays HTML for everyone. Browsers ask for HTML first, so
// they never get the text version, and app/md/route.ts is never cached at the CDN, so the two can't get mixed up.
export const config = {
  // everything public: not Next's own files, the API, the admin, draft previews, files with an extension, or the Markdown route itself
  matcher: ['/((?!_next|api|admin|draft|md$|.*\\..*).*)'],
};

// the pages that exist (any other address is a 404 in both versions)
const KNOWN = /^\/(about|contact|p\/[^/]+|region\/[^/]+|category\/[^/]+)\/?$/;

const wantsMarkdown = (accept: string) => {
  const types = accept.toLowerCase().split(',').map(t => t.trim().split(';')[0]);
  const m = types.indexOf('text/markdown');
  const h = types.indexOf('text/html');
  return m >= 0 && (h < 0 || m < h);
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (req.method !== 'GET' || KNOWN.test(path) || !wantsMarkdown(req.headers.get('accept') || '')) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/md';
  url.search = '';
  // the asked-for address travels in a request header (a rewritten request keeps its original URL)
  const headers = new Headers(req.headers);
  headers.set('x-md-path', path);
  return NextResponse.rewrite(url, { request: { headers } });
}
