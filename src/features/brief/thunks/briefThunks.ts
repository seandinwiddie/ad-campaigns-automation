/**
 * Brief thunks handle the asynchronous processing and validation of campaign briefs.
 * It provides the logic for converting raw user input into structured data.
 * 
 * **User Story:**
 * - As a marketer, I want to paste my campaign ideas in JSON or YAML format and
 *   have the system automatically extract product names and brand guidelines
 *   so I don't have to fill out complex forms manually.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { CampaignBrief } from '@/features/brief/types/campaignBriefType';
import type { ValidationError } from '@/features/brief/types/validationErrorType';
import * as yaml from 'js-yaml';

/**
 * Formats a raw string into a URL-friendly slug.
 */
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Parses raw input text (JSON or YAML) into a CampaignBrief object.
 * Applies defaults and transforms common field variations to standard keys.
 * 
 * @param input - The raw raw text string from the editor.
 * @returns A structured CampaignBrief object.
 */
const parseBriefInput = (input: string): CampaignBrief => {
  const parsed = (() => {
    try {
      return JSON.parse(input);
    } catch {
      return yaml.load(input);
    }
  })();

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Brief content must be an object');
  }

  const raw = parsed as Record<string, unknown>;
  const rawProducts = Array.isArray(raw.products) ? raw.products : [];
  const products: CampaignBrief['products'] = [];
  for (let index = 0; index < rawProducts.length; index += 1) {
    const product = rawProducts[index];
    if (!product || typeof product !== 'object') {
      continue;
    }

    const record = product as Record<string, unknown>;
    const name = typeof record.name === 'string' ? record.name.trim() : '';
    if (!name) {
      continue;
    }

    products.push({
      id:
        (typeof record.id === 'string' && record.id.trim()) ||
        name ||
        slugify(name) ||
        `product-${index + 1}`,
      name,
      description: typeof record.description === 'string' ? record.description.trim() : '',
      existingAsset:
        typeof record.existingAsset === 'string'
          ? record.existingAsset
          : typeof record.assetUrl === 'string'
            ? record.assetUrl
            : undefined,
    });
  }

  const rawBrandGuidelines =
    raw.brandGuidelines && typeof raw.brandGuidelines === 'object'
      ? (raw.brandGuidelines as Record<string, unknown>)
      : null;
  const colorsFromArray =
    rawBrandGuidelines && Array.isArray(rawBrandGuidelines.colors)
      ? rawBrandGuidelines.colors.filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
      : [];
  const primaryColor =
    rawBrandGuidelines && typeof rawBrandGuidelines.primaryColor === 'string'
      ? rawBrandGuidelines.primaryColor
      : '';
  const secondaryColor =
    rawBrandGuidelines && typeof rawBrandGuidelines.secondaryColor === 'string'
      ? rawBrandGuidelines.secondaryColor
      : '';
  const prohibitedWords =
    rawBrandGuidelines && Array.isArray(rawBrandGuidelines.prohibitedWords)
      ? rawBrandGuidelines.prohibitedWords.filter((word): word is string => typeof word === 'string' && word.trim().length > 0)
      : [];

  const colors = colorsFromArray.length > 0 ? colorsFromArray : [primaryColor, secondaryColor].filter(Boolean);
  const brandGuidelines =
    colors.length > 0 || prohibitedWords.length > 0
      ? {
          colors,
          prohibitedWords,
        }
      : undefined;

  return {
    campaignName:
      typeof raw.campaignName === 'string' && raw.campaignName.trim().length > 0
        ? raw.campaignName
        : 'Untitled Campaign',
    products,
    targetRegion:
      typeof raw.targetRegion === 'string'
        ? raw.targetRegion.trim()
        : typeof raw.region === 'string'
          ? raw.region.trim()
          : '',
    targetAudience:
      typeof raw.targetAudience === 'string'
        ? raw.targetAudience.trim()
        : typeof raw.audience === 'string'
          ? raw.audience.trim()
          : '',
    campaignMessage:
      typeof raw.campaignMessage === 'string'
        ? raw.campaignMessage.trim()
        : typeof raw.message === 'string'
          ? raw.message.trim()
          : '',
    brandGuidelines,
  };
};

/**
 * Validates a parsed campaign brief against business rules.
 * Requires at least 2 products and all target segment fields to be populated.
 */
const validateBrief = (brief: CampaignBrief): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!brief.products || brief.products.length < 2) {
    errors.push({ field: 'products', message: 'At least 2 products are required' });
  }
  if (!brief.targetRegion) {
    errors.push({ field: 'targetRegion', message: 'Target region is required' });
  }
  if (!brief.targetAudience) {
    errors.push({ field: 'targetAudience', message: 'Target audience is required' });
  }
  if (!brief.campaignMessage) {
    errors.push({ field: 'campaignMessage', message: 'Campaign message is required' });
  }
  return errors;
};

/**
 * Async thunk to load and validate a campaign brief from raw text.
 * Supports JSON and YAML parsing.
 * Triggers state updates in the brief slice upon success or failure.
 */
 export const loadBrief = createAsyncThunk<
  CampaignBrief,
  string,
  { rejectValue: ValidationError[] }
>('brief/loadBrief', async (input: string, { rejectWithValue }) => {
  const brief = parseBriefInput(input);
  const errors = validateBrief(brief);
  if (errors.length > 0) {
    return rejectWithValue(errors);
  }
  return brief;
});
