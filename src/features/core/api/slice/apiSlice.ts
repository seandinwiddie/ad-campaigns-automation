import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com';
const OPENAI_API_BASE_URL = 'https://api.openai.com';
const GEMINI_IMAGE_MODEL_CANDIDATES = ['gemini-2.5-flash'] as const;
const GEMINI_TEXT_MODEL_CANDIDATES = ['gemini-2.5-flash'] as const;
const OPENAI_IMAGE_MODELS = ['dall-e-3', 'dall-e-2'] as const;
const OPENAI_TEXT_MODEL = 'gpt-4o-mini';

type GeminiImageResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { mimeType?: string; data?: string };
        text?: string;
      }>;
    };
  }>;
};

type GeminiTextResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

type ApiCallResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const parseErrorText = async (response: Response): Promise<string> => {
  const errorMsg = await response.text();
  try {
    const jsonObj = JSON.parse(errorMsg);
    if (typeof jsonObj?.error?.message === 'string' && jsonObj.error.message.trim().length > 0) {
      return jsonObj.error.message;
    }
  } catch {
    // Not JSON
  }
  return errorMsg;
};

const isGeminiHighDemandError = (message: string): boolean => {
  const normalized = message.toLowerCase();
  return normalized.includes('currently experiencing high demand')
    || normalized.includes('spikes in demand are usually temporary')
    || normalized.includes('please try again later');
};

const generateImageWithGemini = async (prompt: string, apiKey: string): Promise<ApiCallResult<{ imageData: string }>> => {
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
        const errorMsg = await parseErrorText(response);
        modelErrors.push(errorMsg);
        continue;
      }

      const payload = (await response.json()) as GeminiImageResponse;
      const parts = payload.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((part) => part.inlineData?.data);
      if (!imagePart?.inlineData?.data) {
        modelErrors.push(`${model}: No image data in response`);
        continue;
      }

      return { success: true, data: { imageData: imagePart.inlineData.data } };
    } catch (error) {
      modelErrors.push(`${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    success: false,
    error: modelErrors.length === 1 ? modelErrors[0] : `All Gemini image models failed: ${modelErrors.join(' | ')}`,
  };
};

const translateTextWithGemini = async (
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<ApiCallResult<{ translatedText: string }>> => {
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
        const errorMsg = await parseErrorText(response);
        modelErrors.push(errorMsg);
        continue;
      }

      const payload = (await response.json()) as GeminiTextResponse;
      const translatedText = payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!translatedText) {
        modelErrors.push(`${model}: No translation text in response`);
        continue;
      }

      return { success: true, data: { translatedText } };
    } catch (error) {
      modelErrors.push(`${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    success: false,
    error: modelErrors.length === 1 ? modelErrors[0] : `All Gemini text models failed: ${modelErrors.join(' | ')}`,
  };
};

const generateImageWithOpenAi = async (prompt: string, openAiApiKey: string): Promise<ApiCallResult<{ imageData: string }>> => {
  const modelErrors: string[] = [];

  for (const model of OPENAI_IMAGE_MODELS) {
    try {
      const response = await fetch(`${OPENAI_API_BASE_URL}/v1/images/generations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          size: '1024x1024',
        }),
      });

      if (!response.ok) {
        const errorMsg = await parseErrorText(response);
        modelErrors.push(`${model}: ${errorMsg}`);
        continue;
      }

      const payload = (await response.json()) as { data?: Array<{ b64_json?: string }> };
      const imageData = payload.data?.[0]?.b64_json;
      if (!imageData) {
        modelErrors.push(`${model}: No image data in response`);
        continue;
      }

      return { success: true, data: { imageData } };
    } catch (error) {
      modelErrors.push(`${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    success: false,
    error: modelErrors.length === 1
      ? `OpenAI image fallback failed: ${modelErrors[0]}`
      : `OpenAI image fallback failed (tried DALL-E 3 and DALL-E 2): ${modelErrors.join(' | ')}`,
  };
};

const POLLINATIONS_IMAGE_URL = 'https://gen.pollinations.ai/image';

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const generateImageWithPollinations = async (
  prompt: string,
  apiKey?: string | null
): Promise<ApiCallResult<{ imageData: string }>> => {
  try {
    const key = apiKey?.trim();
    const url = `${POLLINATIONS_IMAGE_URL}/${encodeURIComponent(prompt)}`;
    const headers: HeadersInit = key ? { Authorization: `Bearer ${key}` } : {};
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Pollinations (free) failed: ${response.status} ${text.slice(0, 80)}` };
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageData = arrayBufferToBase64(arrayBuffer);
    if (!imageData || imageData.length < 100) {
      return { success: false, error: 'Pollinations (free): No image data in response' };
    }

    return { success: true, data: { imageData } };
  } catch (error) {
    return {
      success: false,
      error: `Pollinations (free) failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

const translateTextWithOpenAi = async (
  text: string,
  targetLanguage: string,
  openAiApiKey: string
): Promise<ApiCallResult<{ translatedText: string }>> => {
  try {
    const response = await fetch(`${OPENAI_API_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_TEXT_MODEL,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: 'You are a translation assistant. Return only the translated text with no additional explanation.',
          },
          {
            role: 'user',
            content: `Translate the following text to ${targetLanguage}:\n\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorMsg = await parseErrorText(response);
      return { success: false, error: `OpenAI text fallback failed: ${errorMsg}` };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const translatedText = payload.choices?.[0]?.message?.content?.trim();
    if (!translatedText) {
      return { success: false, error: 'OpenAI text fallback failed: No translation text in response' };
    }

    return { success: true, data: { translatedText } };
  } catch (error) {
    return {
      success: false,
      error: `OpenAI text fallback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: GEMINI_API_BASE_URL }),
  endpoints: (builder) => ({
    generateImage: builder.mutation<
      { imageData: string },
      { prompt: string; apiKey?: string | null; openAiApiKey?: string | null }
    >({
      queryFn: async ({ prompt, apiKey, openAiApiKey }) => {
        const tryPollinationsAsFallback = async (priorError: string) => {
          const pollinationsResult = await generateImageWithPollinations(prompt);
          if (pollinationsResult.success) {
            return { data: pollinationsResult.data };
          }
          return {
            error: {
              status: 'CUSTOM_ERROR' as const,
              error: `${priorError} Pollinations (free) fallback also failed: ${pollinationsResult.error}`,
            },
          };
        };

        if (apiKey && apiKey.trim().length > 0) {
          const geminiResult = await generateImageWithGemini(prompt, apiKey);
          if (geminiResult.success) {
            return { data: geminiResult.data };
          }

          const hasOpenAiKey = typeof openAiApiKey === 'string' && openAiApiKey.trim().length > 0;
          if (hasOpenAiKey) {
            const openAiResult = await generateImageWithOpenAi(prompt, openAiApiKey);
            if (openAiResult.success) {
              return { data: openAiResult.data };
            }
            return tryPollinationsAsFallback(openAiResult.error);
          }

          return tryPollinationsAsFallback(geminiResult.error);
        }

        if (openAiApiKey && openAiApiKey.trim().length > 0) {
          const openAiResult = await generateImageWithOpenAi(prompt, openAiApiKey);
          if (openAiResult.success) {
            return { data: openAiResult.data };
          }
          return tryPollinationsAsFallback(openAiResult.error);
        }

        const pollinationsResult = await generateImageWithPollinations(prompt, pollinationsApiKey);
        if (pollinationsResult.success) {
          return { data: pollinationsResult.data };
        }
        return {
          error: {
            status: 'CUSTOM_ERROR' as const,
            error: `No API keys configured. Pollinations also failed: ${pollinationsResult.error}. Add a Gemini, OpenAI, or Pollinations API key in Settings. Get a free Pollinations key at enter.pollinations.ai`,
          },
        };
      },
    }),
    translateText: builder.mutation<
      { translatedText: string },
      { text: string; targetLanguage: string; apiKey?: string | null; openAiApiKey?: string | null }
    >({
      queryFn: async ({ text, targetLanguage, apiKey, openAiApiKey }) => {
        if (apiKey && apiKey.trim().length > 0) {
          const geminiResult = await translateTextWithGemini(text, targetLanguage, apiKey);
          if (geminiResult.success) {
            return { data: geminiResult.data };
          }

          const shouldFallbackToOpenAi =
            typeof openAiApiKey === 'string'
            && openAiApiKey.trim().length > 0;

          if (shouldFallbackToOpenAi) {
            const openAiResult = await translateTextWithOpenAi(text, targetLanguage, openAiApiKey);
            if (openAiResult.success) {
              return { data: openAiResult.data };
            }
            return { error: { status: 'CUSTOM_ERROR', error: openAiResult.error } };
          }

          return { error: { status: 'CUSTOM_ERROR', error: geminiResult.error } };
        }

        if (openAiApiKey && openAiApiKey.trim().length > 0) {
          const openAiResult = await translateTextWithOpenAi(text, targetLanguage, openAiApiKey);
          if (openAiResult.success) {
            return { data: openAiResult.data };
          }
          return { error: { status: 'CUSTOM_ERROR', error: openAiResult.error } };
        }

        return {
          error: {
            status: 'CUSTOM_ERROR',
            error: 'No AI API key configured. Add a Gemini API key or OpenAI API key in Settings.',
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
            const errorMsg = await parseErrorText(response);
            return { error: { status: response.status, data: errorMsg } };
          }
          return { data: { success: true } };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),
    testOpenAiApiKey: builder.mutation<{ success: boolean }, { apiKey: string }>({
      queryFn: async ({ apiKey }) => {
        try {
          const response = await fetch(`${OPENAI_API_BASE_URL}/v1/models`, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });

          if (!response.ok) {
            const errorMsg = await parseErrorText(response);
            return { error: { status: response.status, data: errorMsg } };
          }

          return { data: { success: true } };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),
    testPollinationsApiKey: builder.mutation<{ success: boolean }, { apiKey: string }>({
      queryFn: async ({ apiKey }) => {
        try {
          const response = await fetch('https://gen.pollinations.ai/account/key', {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          });
          if (!response.ok) {
            const errorMsg = await parseErrorText(response);
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
  useTestOpenAiApiKeyMutation,
  useTestPollinationsApiKeyMutation,
  useTestDropboxTokenMutation,
} = apiSlice;
