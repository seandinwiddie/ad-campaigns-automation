import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@/app/store';
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
import { buildCreativeVariant, detectDominantColors } from '@/features/pipeline/listeners/pipelineImageUtils';

export const listenerMiddleware = createListenerMiddleware();

type RequestError = {
  error?: unknown;
  data?: unknown;
  message?: unknown;
};

const resolveRequestErrorMessage = (value: unknown): string => {
  if (!value || typeof value !== 'object') {
    return 'Failed to generate image';
  }

  const error = value as RequestError;
  if (typeof error.error === 'string' && error.error.trim().length > 0) {
    return error.error;
  }

  if (error.data && typeof error.data === 'object') {
    const nestedErrorMessage = (error.data as { error?: { message?: unknown } }).error?.message;
    if (typeof nestedErrorMessage === 'string' && nestedErrorMessage.trim().length > 0) {
      return nestedErrorMessage;
    }
  }

  if (typeof error.data === 'string' && error.data.trim().length > 0) {
    return error.data;
  }

  if (typeof error.message === 'string' && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Failed to generate image';
};

const processProduct = async (
  product: Product,
  apiKey: string,
  dropboxAccessToken: string,
  originalCampaignMessage: string,
  localizedCampaignMessage: string,
  targetRegion: string,
  dispatch: AppDispatch,
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
    let generated;
    try {
      generated = await dispatch(
        apiSlice.endpoints.generateImage.initiate({
          prompt,
          apiKey,
        })
      ).unwrap();
    } catch (err: unknown) {
      const errorMessage = resolveRequestErrorMessage(err);

      // Mark all creatives for this product as failed
      ASPECT_RATIOS.forEach((ratio) => {
        dispatch(
          creativeFailed({
            id: `${product.id}_${ratio.ratio}`,
            error: errorMessage,
          })
        );
      });
      throw new Error(errorMessage);
    }

    dispatch(
      assetGenerated({
        productId: product.id,
        imageData: generated.imageData,
      })
    );
    sourceImageUrl = `data:image/png;base64,${generated.imageData}`;
  }

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
        const composed = await buildCreativeVariant(sourceImageUrl, ratio, localizedCampaignMessage);
        await dispatch(
          apiSlice.endpoints.saveCreativeToDropbox.initiate({
            path: `/${outputPath}`,
            contentBase64: composed.contentBase64,
            accessToken: dropboxAccessToken,
          })
        ).unwrap();

        dispatch(
          creativePersisted({
            id: creativeId,
            productName: product.name,
            formatName: ratio.name,
            outputUrl: composed.outputUrl,
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

  const detectedColors = await detectDominantColors(sourceImageUrl);
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
          listenerApi.dispatch as AppDispatch,
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
