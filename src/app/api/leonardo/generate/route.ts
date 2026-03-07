import { NextRequest, NextResponse } from 'next/server';
import { generateLeonardoImage } from '@/lib/leonardo';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null) as {
    prompt?: string;
    apiKey?: string;
  } | null;

  const prompt = payload?.prompt?.trim();
  const apiKey = payload?.apiKey?.trim();

  if (!prompt) {
    return new Response('Prompt is required.', { status: 400 });
  }

  if (!apiKey) {
    return new Response('Leonardo API key is required.', { status: 400 });
  }

  const result = await generateLeonardoImage(prompt, apiKey);
  if (!result.success) {
    return new Response(result.error, { status: result.status });
  }

  return NextResponse.json(result.data);
}
