import type { CampaignBrief } from '@/features/brief/types/campaignBriefType';
import type { Product } from '@/features/brief/types/productType';

export const sampleStoryProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'EcoBottle',
    description: 'Reusable bottle from recycled material',
  },
  {
    id: 'prod-2',
    name: 'SolarCharger',
    description: 'Portable solar charger',
  },
];

export const sampleStoryBrief: CampaignBrief = {
  campaignName: 'Summer Eco Campaign 2025',
  products: sampleStoryProducts,
  targetRegion: 'United States',
  targetAudience: 'Eco-conscious millennials',
  campaignMessage: 'Stay Green, Live Clean',
};
