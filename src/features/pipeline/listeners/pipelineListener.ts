import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { apiSlice } from '@/features/core/api/slice/apiSlice';
import {
  startPipeline,
  advanceStep,
  prepareLocalization,
  setLocalizedCampaignMessage,
  setCurrentProduct,
  productCompleted,
  productFailed,
  pipelineComplete,
  pipelineError,
} from '@/features/pipeline/slice/pipelineActions';
import { resolveAsset, assetGenerating, assetGenerated, assetFailed } from '@/features/assets/slice/assetsActions';
import { getCreativeOutputPath } from '@/features/creative/slice/creativeSlice';
import { initCreatives, creativePersisted, creativeFailed } from '@/features/creative/slice/creativeActions';
import {
  checkBrandColors,
  checkProhibitedWords,
  reportComplianceForProduct,
  setBrandGuidelines,
} from '@/features/compliance/slice/complianceActions';
import { ASPECT_RATIOS } from '@/features/creative/constants/formatAspectRatios';
import type { Product } from '@/features/brief/types/productType';

export const listenerMiddleware = createListenerMiddleware();

const HEX = '0123456789ABCDEF';

const toHex = (value: number): string => {
  const normalized = Math.max(0, Math.min(255, value));
  const high = Math.floor(normalized / 16);
  const low = normalized % 16;
  return `${HEX[high]}${HEX[low]}`;
};

const rgbToHex = (r: number, g: number, b: number): string => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

const quantize = (value: number): number => {
  const bucket = Math.round(value / 32) * 32;
  return Math.max(0, Math.min(255, bucket));
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let idx = 0; idx < bytes.length; idx += 1) {
    binary += String.fromCharCode(bytes[idx]);
  }
  return btoa(binary);
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image for compliance check'));
    image.src = src;
  });

const detectDominantColors = async (imageUrl: string, count = 5): Promise<string[]> => {
  if (typeof window === 'undefined') {
    return [];
  }

  const image = await loadImage(imageUrl);
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (!context) {
    return [];
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const colorCounts = new Map<string, number>();

  for (let idx = 0; idx < pixels.length; idx += 4) {
    if (pixels[idx + 3] === 0) {
      continue;
    }
    const key = rgbToHex(
      quantize(pixels[idx]),
      quantize(pixels[idx + 1]),
      quantize(pixels[idx + 2])
    );
    colorCounts.set(key, (colorCounts.get(key) ?? 0) + 1);
  }

  return [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([color]) => color);
};

const processProduct = async (
  product: Product,
  apiKey: string,
  dropboxAccessToken: string,
  originalCampaignMessage: string,
  localizedCampaignMessage: string,
  targetRegion: string,
  dispatch: (action: unknown) => any,
  getState: () => RootState
): Promise<void> => {
  dispatch(setCurrentProduct(product.id));
  let sourceImageUrl: string;

  if (product.existingAsset) {
    dispatch(resolveAsset({ productId: product.id, url: product.existingAsset }));
    sourceImageUrl = product.existingAsset;
  } else {
    dispatch(resolveAsset({ productId: product.id }));
    dispatch(assetGenerating(product.id));
    const prompt = `${product.name}: ${product.description}`;
    const generated = await dispatch(
      apiSlice.endpoints.generateImage.initiate({
        prompt,
        apiKey,
      })
    ).unwrap();

    dispatch(
      assetGenerated({
        productId: product.id,
        imageData: generated.imageData,
      })
    );
    sourceImageUrl = `data:image/png;base64,${generated.imageData}`;
  }

  const response = await fetch(sourceImageUrl);
  if (!response.ok) {
    throw new Error(`Failed to load source asset for ${product.name}`);
  }
  const contentBase64 = arrayBufferToBase64(await response.arrayBuffer());
  const detectedColors = await detectDominantColors(sourceImageUrl);

  const creativeResults = await Promise.all(
    ASPECT_RATIOS.map(async (ratio) => {
      const creativeId = `${product.id}_${ratio.ratio}`;
      const metadata = {
        originalCampaignMessage,
        localizedCampaignMessage,
        targetRegion,
        generatedAtIso: new Date().toISOString(),
      };
      const outputPath = getCreativeOutputPath(product.name, ratio.name);

      try {
        await dispatch(
          apiSlice.endpoints.saveCreativeToDropbox.initiate({
            path: `/${outputPath}`,
            contentBase64,
            accessToken: dropboxAccessToken,
          })
        ).unwrap();

        dispatch(
          creativePersisted({
            id: creativeId,
            productName: product.name,
            formatName: ratio.name,
            outputUrl: sourceImageUrl,
            metadata,
          })
        );
        return true;
      } catch (error) {
        dispatch(
          creativeFailed({
            id: creativeId,
            error: error instanceof Error ? error.message : 'Failed to upload creative to Dropbox',
          })
        );
        return false;
      }
    })
  );

  if (!creativeResults.some(Boolean)) {
    throw new Error(`All creative uploads failed for ${product.name}`);
  }

  dispatch(checkBrandColors(detectedColors));
  dispatch(checkProhibitedWords(localizedCampaignMessage));

  const issues = getState().compliance.issues;
  const colorCompliance = issues.every((issue) => issue.type !== 'brand_color');
  dispatch(
    reportComplianceForProduct({
      productName: product.name,
      colorCompliance,
      detectedColors,
    })
  );

  dispatch(productCompleted({ productId: product.id }));
};

listenerMiddleware.startListening({
  actionCreator: startPipeline,
  effect: async (_action, listenerApi) => {
    const startedAt = Date.now();
    const state = listenerApi.getState() as RootState;
    const brief = state.brief.brief;
    const apiKey = state.settings.apiKey;
    const dropboxAccessToken = state.settings.dropboxAccessToken;

    if (!brief) {
      listenerApi.dispatch(pipelineError('No brief loaded'));
      return;
    }

    if (!apiKey) {
      listenerApi.dispatch(pipelineError('API key not configured'));
      return;
    }

    if (!dropboxAccessToken) {
      listenerApi.dispatch(pipelineError('Dropbox access token not configured'));
      return;
    }

    if (!state.brief.isValid) {
      listenerApi.dispatch(pipelineError('Brief validation failed'));
      return;
    }

    if (brief.brandGuidelines) {
      listenerApi.dispatch(
        setBrandGuidelines({
          colors: brief.brandGuidelines.colors,
          prohibitedWords: brief.brandGuidelines.prohibitedWords,
        })
      );
    }

    listenerApi.dispatch(
      prepareLocalization({
        targetRegion: brief.targetRegion,
        campaignMessage: brief.campaignMessage,
      })
    );

    const preTranslateState = listenerApi.getState() as RootState;
    const targetLanguage = preTranslateState.pipeline.targetLanguage;

    if (targetLanguage) {
      try {
        const translated = await listenerApi.dispatch(
          apiSlice.endpoints.translateText.initiate({
            text: brief.campaignMessage,
            targetLanguage,
            apiKey,
          })
        ).unwrap();
        listenerApi.dispatch(setLocalizedCampaignMessage(translated.translatedText));
      } catch {
        listenerApi.dispatch(setLocalizedCampaignMessage(brief.campaignMessage));
      }
    }

    const localizedState = listenerApi.getState() as RootState;
    const originalCampaignMessage = localizedState.pipeline.originalCampaignMessage || brief.campaignMessage;
    const localizedCampaignMessage = localizedState.pipeline.localizedCampaignMessage || brief.campaignMessage;

    listenerApi.dispatch(initCreatives({ productIds: brief.products.map((p) => p.id) }));

    listenerApi.dispatch(advanceStep());
    listenerApi.dispatch(advanceStep());

    for (const product of brief.products) {
      if (listenerApi.signal.aborted) {
        return;
      }
      try {
        await processProduct(
          product,
          apiKey,
          dropboxAccessToken,
          originalCampaignMessage,
          localizedCampaignMessage,
          brief.targetRegion,
          listenerApi.dispatch as (action: unknown) => any,
          () => listenerApi.getState() as RootState
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        listenerApi.dispatch(productFailed({ productId: product.id, error: message }));
        listenerApi.dispatch(assetFailed({ productId: product.id, error: message }));
      }
    }

    listenerApi.dispatch(advanceStep());

    const finalState = listenerApi.getState() as RootState;
    const productStatuses = Object.values(finalState.pipeline.products);
    const successCount = productStatuses.filter((product) => product.status === 'completed').length;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

    listenerApi.dispatch(
      pipelineComplete({
        successCount,
        totalProducts: brief.products.length,
        elapsedSeconds,
      })
    );
  },
});

export default listenerMiddleware;
