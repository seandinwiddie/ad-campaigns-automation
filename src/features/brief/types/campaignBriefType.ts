import type { BrandGuidelines } from './brandGuidelinesType';
import type { Product } from './productType';

export interface CampaignBrief {
  campaignName: string;
  products: Product[];
  targetRegion: string;
  targetAudience: string;
  campaignMessage: string;
  brandGuidelines?: BrandGuidelines;
}
