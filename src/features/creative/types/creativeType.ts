/**
 * Defines the per-variant creative record that the pipeline updates from initialization through persistence.
 * It is the canonical internal model for a single output variant, carrying identity, ratio,
 * workflow status, generated URLs, persistent paths, metadata, and failure details.
 *
 * **User Story:**
 * - As the pipeline processes each ad format, I want one complete creative record per variant so
 *   generation progress, output locations, and errors can all be tracked in one place.
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
