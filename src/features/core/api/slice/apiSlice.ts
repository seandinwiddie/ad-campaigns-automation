import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/rootReducer';

const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com';
const GEMINI_IMAGE_MODEL_CANDIDATES = ['gemini-3-flash-preview'] as const;
const GEMINI_TEXT_MODEL_CANDIDATES = ['gemini-3-flash-preview'] as const;

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: GEMINI_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const apiKey = state.settings.apiKey;
      if (apiKey) {
        headers.set('x-goog-api-key', apiKey);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    generateImage: builder.mutation<
      { imageData: string },
      { prompt: string; apiKey: string }
    >({
      queryFn: async ({ prompt, apiKey }) => {
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        };

        const modelErrors: string[] = [];
        for (const model of GEMINI_IMAGE_MODEL_CANDIDATES) {
          try {
            const response = await fetch(`${GEMINI_API_BASE_URL}/v1beta/models/${model}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
              let errorMsg = await response.text();
              try {
                const jsonObj = JSON.parse(errorMsg);
                if (jsonObj?.error?.message) {
                  errorMsg = jsonObj.error.message;
                }
              } catch { }
              modelErrors.push(errorMsg);
              continue;
            }

            const payload = (await response.json()) as {
              candidates: Array<{
                content: {
                  parts: Array<{
                    inlineData?: { mimeType: string; data: string };
                    text?: string;
                  }>;
                };
              }>;
            };
            const parts = payload.candidates?.[0]?.content?.parts ?? [];
            const imagePart = parts.find((p) => p.inlineData);
            if (!imagePart?.inlineData?.data) {
              modelErrors.push(`${model}: No image data in response`);
              continue;
            }

            return { data: { imageData: imagePart.inlineData.data } };
          } catch (error) {
            modelErrors.push(`${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: modelErrors.length === 1 ? modelErrors[0] : `All image models failed: ${modelErrors.join(' | ')}`,
          },
        };
      },
    }),
    translateText: builder.mutation<
      { translatedText: string },
      { text: string; targetLanguage: string; apiKey: string }
    >({
      queryFn: async ({ text, targetLanguage, apiKey }) => {
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: `Translate the following text to ${targetLanguage}. Only return the translation, nothing else:\n\n${text}`,
                },
              ],
            },
          ],
        };

        const modelErrors: string[] = [];
        for (const model of GEMINI_TEXT_MODEL_CANDIDATES) {
          try {
            const response = await fetch(`${GEMINI_API_BASE_URL}/v1beta/models/${model}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
              let errorMsg = await response.text();
              try {
                const jsonObj = JSON.parse(errorMsg);
                if (jsonObj?.error?.message) {
                  errorMsg = jsonObj.error.message;
                }
              } catch { }
              modelErrors.push(errorMsg);
              continue;
            }

            const payload = (await response.json()) as {
              candidates: Array<{
                content: {
                  parts: Array<{ text?: string }>;
                };
              }>;
            };
            const translatedText = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (!translatedText) {
              modelErrors.push(`${model}: No translation text in response`);
              continue;
            }

            return { data: { translatedText } };
          } catch (error) {
            modelErrors.push(`${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }

        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: modelErrors.length === 1 ? modelErrors[0] : `All text models failed: ${modelErrors.join(' | ')}`,
          },
        };
      },
    }),
    testGeminiApiKey: builder.mutation<{ success: boolean }, { apiKey: string }>({
      queryFn: async ({ apiKey }) => {
        try {
          const response = await fetch(`${GEMINI_API_BASE_URL}/v1beta/models?key=${apiKey}`, {
            headers: {
              'x-goog-api-key': apiKey,
            },
          });
          if (!response.ok) {
            let errorMsg = await response.text();
            try {
              const jsonObj = JSON.parse(errorMsg);
              if (jsonObj?.error?.message) {
                errorMsg = jsonObj.error.message;
              }
            } catch { }
            return { error: { status: response.status, data: errorMsg } };
          }
          return { data: { success: true } };
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
  useTranslateTextMutation,
  useSaveCreativeToDropboxMutation,
  useTestGeminiApiKeyMutation,
  useTestDropboxTokenMutation,
} = apiSlice;
