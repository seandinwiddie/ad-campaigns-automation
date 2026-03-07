import { POST } from './route';
import { generateLeonardoImage } from '@/features/core/api/client/leonardoClient';

jest.mock('@/features/core/api/client/leonardoClient', () => ({
  generateLeonardoImage: jest.fn(),
}));

const mockedGenerateLeonardoImage = jest.mocked(generateLeonardoImage);

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
  new Request('http://localhost/api/leonardo/generate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }) as any;

describe('POST /api/leonardo/generate', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns 400 when the prompt is missing', async () => {
    const response = await POST(createRequest({ prompt: '   ', apiKey: 'key' }));

    expect(response.status).toBe(400);
    await expect(response.text()).resolves.toBe('Prompt is required.');
    expect(mockedGenerateLeonardoImage).not.toHaveBeenCalled();
  });

  it('returns 400 when the API key is missing', async () => {
    const response = await POST(createRequest({ prompt: 'New product shot', apiKey: '   ' }));

    expect(response.status).toBe(400);
    await expect(response.text()).resolves.toBe('Leonardo API key is required.');
    expect(mockedGenerateLeonardoImage).not.toHaveBeenCalled();
  });

  it('passes trimmed prompt and API key values into Leonardo generation', async () => {
    mockedGenerateLeonardoImage.mockResolvedValueOnce({
      success: true,
      data: { imageData: 'abc123' },
    });

    const response = await POST(
      createRequest({
        prompt: '  New product shot  ',
        apiKey: '  live-key  ',
      })
    );

    expect(mockedGenerateLeonardoImage).toHaveBeenCalledWith('New product shot', 'live-key');
    expect(response.status).toBe(200);
  });

  it('forwards Leonardo generation failures with the original status code', async () => {
    mockedGenerateLeonardoImage.mockResolvedValueOnce({
      success: false,
      status: 504,
      error: 'Leonardo generation timed out before an image was ready.',
    });

    const response = await POST(createRequest({ prompt: 'New product shot', apiKey: 'bad-key' }));

    expect(response.status).toBe(504);
    await expect(response.text()).resolves.toBe('Leonardo generation timed out before an image was ready.');
  });
});
