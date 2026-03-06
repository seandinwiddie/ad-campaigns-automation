import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/rootReducer';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://generativelanguage.googleapis.com',
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
      query: ({ prompt, apiKey }) => ({
        url: `/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        method: 'POST',
        body: {
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
        },
      }),
      transformResponse: (response: {
        candidates: Array<{
          content: {
            parts: Array<{
              inlineData?: { mimeType: string; data: string };
              text?: string;
            }>;
          };
        }>;
      }) => {
        const parts = response.candidates?.[0]?.content?.parts ?? [];
        const imagePart = parts.find((p) => p.inlineData);
        if (!imagePart?.inlineData) {
          throw new Error('No image data in response');
        }
        return { imageData: imagePart.inlineData.data };
      },
    }),
    translateText: builder.mutation<
      { translatedText: string },
      { text: string; targetLanguage: string; apiKey: string }
    >({
      query: ({ text, targetLanguage, apiKey }) => ({
        url: `/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        method: 'POST',
        body: {
          contents: [
            {
              parts: [
                {
                  text: `Translate the following text to ${targetLanguage}. Only return the translation, nothing else:\n\n${text}`,
                },
              ],
            },
          ],
        },
      }),
      transformResponse: (response: {
        candidates: Array<{
          content: {
            parts: Array<{ text?: string }>;
          };
        }>;
      }) => {
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error('No translation in response');
        }
        return { translatedText: text.trim() };
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

export const { useGenerateImageMutation, useTranslateTextMutation, useSaveCreativeToDropboxMutation } = apiSlice;
