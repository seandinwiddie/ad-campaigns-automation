import { NextRequest, NextResponse } from 'next/server';
import { validateLeonardoApiKey } from '@/features/core/api/client/leonardoClient';

export const runtime = 'nodejs';

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
