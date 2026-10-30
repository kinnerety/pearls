import { buildLlms } from '@/lib/llms';
import { SITE_URL } from '@/lib/slug';
import { getTexts } from '@/lib/store';

// Markdown for AI agents that ask for it (Accept: text/markdown; middleware.ts sends them here), Kinneret 30.10.2026:
// only two cases, on purpose. The home page = the llms.txt guide (same texts she edits in /admin), and an address the site
// doesn't know = her "not found" text with a 404 status and a way back (the is-agentic check "agent-friendly 404s").
// Every other page keeps its normal HTML for everyone.

export type MdPage = { status: number; body: string };

// Her text for the 404 page, without the ** / == markers of the site's rich text
const plain = (s: string) => s.replace(/\*\*|==/g, '').trim();

export async function markdownFor(path: string): Promise<MdPage> {
  if (path.replace(/\/+$/, '') === '') return { status: 200, body: await buildLlms(false) };
  const texts = await getTexts();
  const body = [
    `# ${plain(texts['notfound.title'])}`, '',
    ...texts['notfound.text'].split('\n').map(l => plain(l)).filter(Boolean).flatMap(l => [l, '']),
    `- [עמוד הבית](${SITE_URL}/)`,
    `- [מדריך לעוזרי AI (llms.txt)](${SITE_URL}/llms.txt)`,
    `- [כל הפנינים (llms-full.txt)](${SITE_URL}/llms-full.txt)`,
    `- [מפת האתר](${SITE_URL}/sitemap.xml)`, '',
  ].join('\n');
  return { status: 404, body };
}
