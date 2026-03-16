/**
 * Defines the UI-facing shape of a composed creative artifact after a format-specific output is produced.
 */
import type { FormatCreativeStatus } from './formatCreativeStatusType';

/**
 * Represents the final output of a creative generation process for a specific product.
 */
export interface CreativeOutput {
  /** Name of the associated product. */
  productName: string;
  /** Label for the aspect ratio (e.g., 'Instagram Square'). */
  format: string;
  /** Local filesystem path or URL to the final PNG. */
  outputPath: string | null;
  /** Current state of this specific asset variant. */
  status: FormatCreativeStatus;
}
