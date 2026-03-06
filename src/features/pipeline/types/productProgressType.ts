import type { ProductStatus } from './productStatusType';

export interface ProductProgress {
  productId: string;
  status: ProductStatus;
  error?: string;
}
