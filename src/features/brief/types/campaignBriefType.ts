/**
 * Defines the canonical campaign brief payload consumed by the downstream pipeline stages.
 * This interface describes the normalized shape that brief parsing must produce before any asset,
 * creative, or compliance workflow can begin.
 *
 * **User Story:**
 * - As a user planning a campaign, I want one structured brief format for products, audience, region,
 *   message, and brand rules so the pipeline can turn my input into consistent campaign outputs.
 */
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
