import { apiSlice } from '@/features/core/api/slice/apiSlice';

export const generationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateProductImage: builder.mutation<
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
                  text: `Generate a high-quality product photograph for advertising: ${prompt}. The image should be clean, professional, well-lit, and suitable for a marketing campaign.`,
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
          throw new Error('No image data in Gemini response');
        }
        return { imageData: imagePart.inlineData.data };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGenerateProductImageMutation } = generationApi;
