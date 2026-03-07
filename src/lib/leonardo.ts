const LEONARDO_API_BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';
const LEONARDO_LIGHTNING_MODEL_ID = 'b24e16ff-06e3-43eb-8d33-4416c2d75876';
const LEONARDO_DEFAULT_IMAGE_SIZE = 768;
const LEONARDO_POLL_DELAY_MS = 1500;
const LEONARDO_MAX_POLL_ATTEMPTS = 20;

type LeonardoSuccess<T> = {
  success: true;
  data: T;
};

type LeonardoFailure = {
  success: false;
  status: number;
  error: string;
};

export type LeonardoResult<T> = LeonardoSuccess<T> | LeonardoFailure;

type LeonardoGenerationCreateResponse = {
  sdGenerationJob?: {
    generationId?: string;
  };
};

type LeonardoGenerationStatusResponse = {
  generations_by_pk?: {
    status?: string;
    generated_images?: Array<{
      url?: string;
    }>;
  };
};

const sleep = async (delayMs: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

const parseErrorText = async (response: Response): Promise<string> => {
  const text = await response.text();
  if (!text.trim()) {
    return `Request failed with status ${response.status}`;
  }

  try {
    const json = JSON.parse(text) as {
      error?: string;
      message?: string;
      detail?: string;
    };

    if (typeof json.error === 'string' && json.error.trim().length > 0) {
      return json.error;
    }

    if (typeof json.message === 'string' && json.message.trim().length > 0) {
      return json.message;
    }

    if (typeof json.detail === 'string' && json.detail.trim().length > 0) {
      return json.detail;
    }
  } catch {
    // Keep the raw text when the payload is not JSON.
  }

  return text;
};

const createLeonardoHeaders = (apiKey: string): HeadersInit => ({
  accept: 'application/json',
  authorization: `Bearer ${apiKey}`,
  'content-type': 'application/json',
});

export const validateLeonardoApiKey = async (apiKey: string): Promise<LeonardoResult<{ success: true }>> => {
  try {
    const response = await fetch(`${LEONARDO_API_BASE_URL}/platformModels`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: await parseErrorText(response),
      };
    }

    return {
      success: true,
      data: { success: true },
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Leonardo API key validation failed',
    };
  }
};

export const generateLeonardoImage = async (
  prompt: string,
  apiKey: string
): Promise<LeonardoResult<{ imageData: string }>> => {
  try {
    const createResponse = await fetch(`${LEONARDO_API_BASE_URL}/generations`, {
      method: 'POST',
      headers: createLeonardoHeaders(apiKey),
      cache: 'no-store',
      body: JSON.stringify({
        prompt,
        modelId: LEONARDO_LIGHTNING_MODEL_ID,
        num_images: 1,
        width: LEONARDO_DEFAULT_IMAGE_SIZE,
        height: LEONARDO_DEFAULT_IMAGE_SIZE,
        alchemy: true,
      }),
    });

    if (!createResponse.ok) {
      return {
        success: false,
        status: createResponse.status,
        error: await parseErrorText(createResponse),
      };
    }

    const createPayload = (await createResponse.json()) as LeonardoGenerationCreateResponse;
    const generationId = createPayload.sdGenerationJob?.generationId;

    if (!generationId) {
      return {
        success: false,
        status: 502,
        error: 'Leonardo did not return a generation ID.',
      };
    }

    for (let attempt = 0; attempt < LEONARDO_MAX_POLL_ATTEMPTS; attempt += 1) {
      if (attempt > 0) {
        await sleep(LEONARDO_POLL_DELAY_MS);
      }

      const statusResponse = await fetch(`${LEONARDO_API_BASE_URL}/generations/${generationId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        cache: 'no-store',
      });

      if (!statusResponse.ok) {
        return {
          success: false,
          status: statusResponse.status,
          error: await parseErrorText(statusResponse),
        };
      }

      const statusPayload = (await statusResponse.json()) as LeonardoGenerationStatusResponse;
      const generation = statusPayload.generations_by_pk;
      const status = generation?.status?.toUpperCase();
      const imageUrl = generation?.generated_images?.find((image) => typeof image.url === 'string' && image.url.length > 0)?.url;

      if (imageUrl) {
        const imageResponse = await fetch(imageUrl, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!imageResponse.ok) {
          return {
            success: false,
            status: imageResponse.status,
            error: `Leonardo generated an image URL, but downloading it failed with status ${imageResponse.status}.`,
          };
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        return {
          success: true,
          data: {
            imageData: Buffer.from(imageBuffer).toString('base64'),
          },
        };
      }

      if (status === 'FAILED' || status === 'ERROR' || status === 'CANCELED') {
        return {
          success: false,
          status: 502,
          error: `Leonardo generation ${generationId} ended with status ${status}.`,
        };
      }
    }

    return {
      success: false,
      status: 504,
      error: 'Leonardo generation timed out before an image was ready.',
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Leonardo image generation failed',
    };
  }
};
