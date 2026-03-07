import type { AssetStatus } from './assetStatusType';

export interface Asset {
  productId: string;
  status: AssetStatus;
  url?: string;
  imageData?: string;
  error?: string;
}
