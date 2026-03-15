import type { BrandGuidelines } from './brandGuidelinesType';
import type { Product } from './productType';

/**
 * Full campaign requirement information provided by the user.
 */
export interface CampaignBrief {
  /** Human-readable identifier for the marketing effort. */
  campaignName: string;
  /** Collection of products to be featured in the campaign. */
  products: Product[];
  /** The geographical market for focus (e.g., 'North America'). */
  targetRegion: string;
  /** Description of the intended customer segment. */
  targetAudience: string;
  /** Central marketing copy or headline for creative overlays. */
  campaignMessage: string;
  /** Optional brand constraints like colors and prohibited words. */
  brandGuidelines?: BrandGuidelines;
}
