import { buildLlms, llmsResponse } from '@/lib/llms';

// /llms.txt: the short guide for AI assistants (site, people, FAQ, structure, region and category pages); the place list is in /llms-full.txt
export async function GET() {
  return llmsResponse(await buildLlms(false));
}
