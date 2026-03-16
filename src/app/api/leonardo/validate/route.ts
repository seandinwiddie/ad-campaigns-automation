/**
 * Server route that validates Leonardo credentials without exposing direct provider calls to the browser.
 */
import { NextRequest, NextResponse } from 'next/server';
import { validateLeonardoApiKey } from '@/features/core/api/client/leonardoClient';

export const runtime = 'nodejs';

/**
 * POST /api/leonardo/validate
 * Validates a Leonardo API key by communicating with the Leonardo.ai platform.
 * Requires an 'apiKey' in the JSON body.
 * 
 * **User Story:**
 * - "As a user, I want to know immediately if my API key is valid before
 *   starting a large automation pipeline."
 */
export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null) as {
    apiKey?: string;
  } | null;

  const apiKey = payload?.apiKey?.trim();
  if (!apiKey) {
    return new Response('Leonardo API key is required.', { status: 400 });
  }

  const result = await validateLeonardoApiKey(apiKey);
  if (!result.success) {
    return new Response(result.error, { status: result.status });
  }

  return NextResponse.json(result.data);
}
