import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const setupApiStore = () => {
    return configureStore({
        reducer: {
            [apiSlice.reducerPath]: apiSlice.reducer,
            settings: (state = { apiKey: 'test-key', dropboxAccessToken: 'test-token' }) => state,
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
