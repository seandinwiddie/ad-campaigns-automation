import type { CreativeAspectRatio } from './creativeAspectRatioType';
import type { CreativeMetadata } from './creativeMetadataType';
import type { CreativeStatus } from './creativeStatusType';

export interface Creative {
  id: string;
  productId: string;
  aspectRatio: CreativeAspectRatio;
  status: CreativeStatus;
  outputUrl?: string;
  outputPath?: string;
  metadata?: CreativeMetadata;
  error?: string;
}
