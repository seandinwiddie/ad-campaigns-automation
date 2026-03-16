/**
 * Verifies the Leonardo validation route's input normalization and upstream error handling.
 * The test cases spell out how the route should treat missing credentials, malformed JSON,
 * successful provider responses, and provider-auth failures.
 *
 * **User Story:**
 * - As a user validating my Leonardo API key, I want the backend route to normalize my input and
 *   return clear validation results so I can trust whether setup is complete before running the pipeline.
 */
import { POST } from './route';
import { validateLeonardoApiKey } from '@/features/core/api/client/leonardoClient';

jest.mock('@/features/core/api/client/leonardoClient', () => ({
  validateLeonardoApiKey: jest.fn(),
}));

const mockedValidateLeonardoApiKey = jest.mocked(validateLeonardoApiKey);

beforeAll(() => {
  if (typeof Response.json !== 'function') {
    Object.defineProperty(Response, 'json', {
      value: (body: unknown, init?: ResponseInit) =>
        new Response(JSON.stringify(body), {
          ...init,
          headers: {
            'content-type': 'application/json',
            ...(init?.headers ?? {}),
          },
        }),
    });
  }
});

const createRequest = (body: unknown) =>
  new Request('http://localhost/api/leonardo/validate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }) as any;

describe('POST /api/leonardo/validate', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 when the request does not include an API key', async () => {
    const response = await POST(createRequest({ apiKey: '   ' }));

    expect(response.status).toBe(400);
    await expect(response.text()).resolves.toBe('Leonardo API key is required.');
    expect(mockedValidateLeonardoApiKey).not.toHaveBeenCalled();
  });

  it('treats invalid JSON as a bad request', async () => {
    const response = await POST(createRequest('{not-json'));

    expect(response.status).toBe(400);
    await expect(response.text()).resolves.toBe('Leonardo API key is required.');
    expect(mockedValidateLeonardoApiKey).not.toHaveBeenCalled();
  });

  it('returns the JSON payload from a successful Leonardo validation', async () => {
    mockedValidateLeonardoApiKey.mockResolvedValueOnce({
      success: true,
      data: { success: true },
    });

    const response = await POST(createRequest({ apiKey: '  live-key  ' }));

    expect(mockedValidateLeonardoApiKey).toHaveBeenCalledWith('live-key');
    expect(response.status).toBe(200);
  });

  it('forwards Leonardo validation failures with the original status code', async () => {
    mockedValidateLeonardoApiKey.mockResolvedValueOnce({
      success: false,
      status: 401,
      error: 'Leonardo rejected the API key.',
    });

    const response = await POST(createRequest({ apiKey: 'bad-key' }));

    expect(response.status).toBe(401);
    await expect(response.text()).resolves.toBe('Leonardo rejected the API key.');
  });
});
