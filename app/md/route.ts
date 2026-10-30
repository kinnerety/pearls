import { markdownFor } from '@/lib/markdown';

// Internal target of middleware.ts: the Markdown version of the page the agent asked for, for agents that asked for text/markdown.
// Never cached at the CDN, so a browser can never be handed the text version by mistake.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // the address the agent asked for, set by middleware.ts; a direct call without it is itself an unknown address
  const path = req.headers.get('x-md-path') || new URL(req.url).searchParams.get('p') || '/md';
  const { status, body } = await markdownFor(path);
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/markdown; charset=utf-8', 'cache-control': 'no-store', vary: 'Accept', 'x-robots-tag': 'noindex' },
  });
}
