import type { ProductAssetStatus } from './productAssetStatusType';

export interface ProductAsset {
  productName: string;
  status: ProductAssetStatus;
  imagePath: string | null;
  isGenerated: boolean;
}
