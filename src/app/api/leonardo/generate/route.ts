/**
 * Server route that validates generation input and proxies Leonardo image requests through the backend runtime.
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateLeonardoImage } from '@/features/core/api/client/leonardoClient';

export const runtime = 'nodejs';

/**
 * POST /api/leonardo/generate
 * Proxies image generation requests to the Leonardo AI client.
 * Requires a 'prompt' and 'apiKey' in the JSON body.
 * 
 * **User Story:**
 * - "As a user, I want the server to handle complex long-polling with AI providers
 *   so the UI remains responsive and simple."
 */
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
