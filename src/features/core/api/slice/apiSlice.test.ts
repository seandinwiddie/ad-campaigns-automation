import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const setupApiStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      settings: (state = { apiKey: 'test-key', openAiApiKey: 'openai-test-key', dropboxAccessToken: 'test-token' }) => state,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

describe('apiSlice', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('testGeminiApiKey', () => {
    it('returns success when API key is valid', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const store = setupApiStore();
      const action = await store.dispatch(apiSlice.endpoints.testGeminiApiKey.initiate({ apiKey: 'valid-key' }));

      expect(action.data).toEqual({ success: true });
      expect(action.error).toBeUndefined();
    });

    it('returns parsed error message when API key is invalid', async () => {
      const errorMsg = 'API key not valid. Please pass a valid API key.';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ error: { message: errorMsg } }),
      });

      const store = setupApiStore();
      const action = await store.dispatch(apiSlice.endpoints.testGeminiApiKey.initiate({ apiKey: 'invalid-key' }));

      expect(action.error).toBeDefined();
      expect((action.error as any).data).toEqual(errorMsg);
    });
  });

  describe('testOpenAiApiKey', () => {
    it('returns success when API key is valid', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const store = setupApiStore();
      const action = await store.dispatch(apiSlice.endpoints.testOpenAiApiKey.initiate({ apiKey: 'valid-key' }));

      expect(action.data).toEqual({ success: true });
      expect(action.error).toBeUndefined();
    });
  });

  describe('generateImage', () => {
    it('falls back to OpenAI when Gemini fails (any error)', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () => JSON.stringify({
            error: { message: 'API key not valid. Please pass a valid API key.' },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: [{ b64_json: 'openai-image-base64' }],
          }),
        });

      const store = setupApiStore();
      const action = await store.dispatch(
        apiSlice.endpoints.generateImage.initiate({
          prompt: 'Product photo',
          apiKey: 'gemini-key',
          openAiApiKey: 'openai-key',
        })
      );

      expect(action.data).toEqual({ imageData: 'openai-image-base64' });
      expect(action.error).toBeUndefined();
      expect((global.fetch as jest.Mock).mock.calls[1][0]).toContain('api.openai.com/v1/images/generations');
    });

    it('falls back to DALL-E 2 when DALL-E 3 fails', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () => JSON.stringify({
            error: { message: 'API key not valid. Please pass a valid API key.' },
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () => JSON.stringify({ error: { message: 'DALL-E 3 billing limit exceeded' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            data: [{ b64_json: 'dalle2-image-base64' }],
          }),
        });

      const store = setupApiStore();
      const action = await store.dispatch(
        apiSlice.endpoints.generateImage.initiate({
          prompt: 'Product photo',
          apiKey: 'gemini-key',
          openAiApiKey: 'openai-key',
        })
      );

      expect(action.data).toEqual({ imageData: 'dalle2-image-base64' });
      expect(action.error).toBeUndefined();
      const fetchCalls = (global.fetch as jest.Mock).mock.calls;
      const openAiCalls = fetchCalls.filter(
        (call: [string]) => typeof call[0] === 'string' && call[0].includes('api.openai.com/v1/images/generations')
      );
      expect(openAiCalls).toHaveLength(2);
    });

    it('falls back to Pollinations when both Gemini and OpenAI fail', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () => JSON.stringify({ error: { message: 'API key not valid' } }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          text: async () => JSON.stringify({ error: { message: 'Rate limit exceeded' } }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          text: async () => JSON.stringify({ error: { message: 'Rate limit exceeded' } }),
        })
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: async () =>
            new Uint8Array([
              0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
              ...Array(80).fill(0),
            ]).buffer,
        });

      const store = setupApiStore();
      const action = await store.dispatch(
        apiSlice.endpoints.generateImage.initiate({
          prompt: 'Product photo',
          apiKey: 'gemini-key',
          openAiApiKey: 'openai-key',
        })
      );

      expect(action.data).toBeDefined();
      expect(action.data?.imageData).toBeDefined();
      expect(typeof action.data?.imageData).toBe('string');
      expect(action.error).toBeUndefined();
      const fetchCalls = (global.fetch as jest.Mock).mock.calls;
      const pollinationsCall = fetchCalls.find(
        (call: [string]) => typeof call[0] === 'string' && call[0].includes('gen.pollinations.ai')
      );
      expect(pollinationsCall).toBeDefined();
    });

    it('uses Pollinations when no API keys are configured', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () =>
          new Uint8Array([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
            ...Array(100).fill(0),
          ]).buffer,
      });

      const store = configureStore({
        reducer: {
          [apiSlice.reducerPath]: apiSlice.reducer,
          settings: () => ({ apiKey: null, openAiApiKey: null, dropboxAccessToken: null }),
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
      });

      const action = await store.dispatch(
        apiSlice.endpoints.generateImage.initiate({
          prompt: 'Product photo',
          apiKey: null,
          openAiApiKey: null,
        })
      );

      expect(action.data).toBeDefined();
      expect(action.data?.imageData).toBeDefined();
      expect(action.error).toBeUndefined();
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain('gen.pollinations.ai');
    });
  });

  describe('testDropboxToken', () => {
    it('returns success when token is valid', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ account_id: '123' }),
      });

      const store = setupApiStore();
      const action = await store.dispatch(apiSlice.endpoints.testDropboxToken.initiate({ accessToken: 'valid-token' }));

      expect(action.data).toEqual({ success: true });
      expect(action.error).toBeUndefined();
    });

    it('returns raw text error when token is invalid', async () => {
      const errorText = 'Error in call to API function "check/user": The given OAuth 2 access token is malformed.';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => errorText,
      });

      const store = setupApiStore();
      const action = await store.dispatch(apiSlice.endpoints.testDropboxToken.initiate({ accessToken: 'invalid-token' }));

      expect(action.error).toBeDefined();
      expect((action.error as any).data).toEqual(errorText);
    });
  });
});
