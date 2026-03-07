import {
  generateLeonardoImage,
  validateLeonardoApiKey,
} from '@/features/core/api/client/leonardoClient';

describe('leonardo', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('validateLeonardoApiKey', () => {
    it('returns success when Leonardo accepts the API key', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(new Response(null, { status: 200 }));

      await expect(validateLeonardoApiKey('test-key')).resolves.toEqual({
        success: true,
        data: { success: true },
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://cloud.leonardo.ai/api/rest/v1/platformModels',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            authorization: 'Bearer test-key',
          }),
        })
      );
    });

    it('returns the parsed Leonardo error payload when validation fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'API key rejected' }), {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        })
      );

      await expect(validateLeonardoApiKey('bad-key')).resolves.toEqual({
        success: false,
        status: 401,
        error: 'API key rejected',
      });
    });

    it('returns a fetch error when the request throws', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('network down'));

      await expect(validateLeonardoApiKey('test-key')).resolves.toEqual({
        success: false,
        status: 500,
        error: 'network down',
      });
    });
  });

  describe('generateLeonardoImage', () => {
    it('returns base64 image data when creation, polling, and download succeed', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ sdGenerationJob: { generationId: 'gen-123' } }), {
            status: 200,
            headers: {
              'content-type': 'application/json',
            },
          })
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              generations_by_pk: {
                status: 'COMPLETE',
                generated_images: [{ url: 'https://cdn.example.com/generated.png' }],
              },
            }),
            {
              status: 200,
              headers: {
                'content-type': 'application/json',
              },
            }
          )
        )
        .mockResolvedValueOnce(new Response('image-bytes', { status: 200 }));

      await expect(generateLeonardoImage('Prompt', 'test-key')).resolves.toEqual({
        success: true,
        data: {
          imageData: Buffer.from('image-bytes').toString('base64'),
        },
      });
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        'https://cloud.leonardo.ai/api/rest/v1/generations',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        'https://cloud.leonardo.ai/api/rest/v1/generations/gen-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(global.fetch).toHaveBeenNthCalledWith(
        3,
        'https://cdn.example.com/generated.png',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('returns the upstream creation error when Leonardo rejects the prompt', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Prompt blocked' }), {
          status: 429,
          headers: {
            'content-type': 'application/json',
          },
        })
      );

      await expect(generateLeonardoImage('Prompt', 'test-key')).resolves.toEqual({
        success: false,
        status: 429,
        error: 'Prompt blocked',
      });
    });

    it('returns a 502 when Leonardo omits the generation ID', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        new Response(JSON.stringify({ sdGenerationJob: {} }), {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        })
      );

      await expect(generateLeonardoImage('Prompt', 'test-key')).resolves.toEqual({
        success: false,
        status: 502,
        error: 'Leonardo did not return a generation ID.',
      });
    });

    it('returns a 502 when Leonardo reports a terminal generation failure', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ sdGenerationJob: { generationId: 'gen-123' } }), {
            status: 200,
            headers: {
              'content-type': 'application/json',
            },
          })
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              generations_by_pk: {
                status: 'FAILED',
                generated_images: [],
              },
            }),
            {
              status: 200,
              headers: {
                'content-type': 'application/json',
              },
            }
          )
        );

      await expect(generateLeonardoImage('Prompt', 'test-key')).resolves.toEqual({
        success: false,
        status: 502,
        error: 'Leonardo generation gen-123 ended with status FAILED.',
      });
    });
  });
});
