/**
 * Defines the per-variant creative record that the pipeline updates from initialization through persistence.
 */
import type { CreativeAspectRatio } from './creativeAspectRatioType';
import type { CreativeMetadata } from './creativeMetadataType';
import type { CreativeStatus } from './creativeStatusType';

/**
 * Represents a single generated creative variant.
 */
export interface Creative {
  /** Unique ID in format {productId}_{ratio}. */
  id: string;
  /** ID of the product this creative belongs to. */
  productId: string;
  /** The intended aspect ratio. */
  aspectRatio: CreativeAspectRatio;
  /** Current state of the generation/persistence flow. */
  status: CreativeStatus;
  /** Temporary browser URL of the generated image. */
  outputUrl?: string;
  /** Persistent cloud path in Dropbox. */
  outputPath?: string;
  /** Associated metadata for the generation. */
  metadata?: CreativeMetadata;
  /** Error message if generation failed. */
  error?: string;
}
