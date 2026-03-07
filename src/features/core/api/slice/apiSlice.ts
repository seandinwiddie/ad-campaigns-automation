import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const parseErrorText = async (response: Response): Promise<string> => {
  const errorText = await response.text();
  return errorText.trim().length > 0 ? errorText : `Request failed with status ${response.status}`;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  endpoints: (builder) => ({
    generateImage: builder.mutation<
      { imageData: string },
      { prompt: string; leonardoApiKey: string }
    >({
      queryFn: async ({ prompt, leonardoApiKey }) => {
        try {
          const response = await fetch('/api/leonardo/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              negative_prompt: "text, watermark, typography, letters, words, logo",
              apiKey: leonardoApiKey,
            }),
          });

          if (!response.ok) {
            return {
              error: {
                status: response.status,
                data: await parseErrorText(response),
              },
            };
          }

          const payload = (await response.json()) as { imageData: string };
          return { data: payload };
        } catch (error) {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: String(error),
            },
          };
        }
      },
    }),
    testLeonardoApiKey: builder.mutation<{ success: boolean }, { apiKey: string }>({
      queryFn: async ({ apiKey }) => {
        try {
          const response = await fetch('/api/leonardo/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey }),
          });
          if (!response.ok) {
            return { error: { status: response.status, data: await parseErrorText(response) } };
          }
          return { data: (await response.json()) as { success: boolean } };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),
    testDropboxToken: builder.mutation<{ success: boolean }, { accessToken: string }>({
      queryFn: async ({ accessToken }) => {
        try {
          const response = await fetch('https://api.dropboxapi.com/2/check/user', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: 'test' }),
          });
          if (!response.ok) {
            const errorText = await response.text();
            return { error: { status: response.status, data: errorText } };
          }
          return { data: { success: true } };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),
    saveCreativeToDropbox: builder.mutation<
      { pathLower: string; rev: string },
      { path: string; contentBase64: string; accessToken: string }
    >({
      queryFn: async ({ path, contentBase64, accessToken }) => {
        try {
          const binary = atob(contentBase64);
          const bytes = new Uint8Array(binary.length);
          for (let idx = 0; idx < binary.length; idx += 1) {
            bytes[idx] = binary.charCodeAt(idx);
          }

          const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/octet-stream',
              'Dropbox-API-Arg': JSON.stringify({
                path,
                mode: 'overwrite',
                autorename: false,
                mute: true,
                strict_conflict: false,
              }),
            },
            body: bytes,
          });

          if (!response.ok) {
            const errorText = await response.text();
            return {
              error: {
                status: response.status,
                data: errorText || 'Dropbox upload failed',
              },
            };
          }

          const data = (await response.json()) as { path_lower: string; rev: string };
          return {
            data: {
              pathLower: data.path_lower,
              rev: data.rev,
            },
          };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Dropbox upload failed',
              data: error instanceof Error ? error.message : 'Dropbox upload failed',
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGenerateImageMutation,
  useSaveCreativeToDropboxMutation,
  useTestLeonardoApiKeyMutation,
  useTestDropboxTokenMutation,
} = apiSlice;
