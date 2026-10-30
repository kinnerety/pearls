import { buildLlms, llmsResponse } from '@/lib/llms';

// /llms-full.txt: the same guide plus one line per place
export async function GET() {
  return llmsResponse(await buildLlms(true));
}
