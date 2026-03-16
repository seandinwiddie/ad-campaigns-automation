/**
 * Defines the UI-facing shape of a composed creative artifact after a format-specific output is produced.
 * It converts internal creative workflow details into a presentation model that results views can
 * display directly without needing the full reducer-level representation.
 *
 * **User Story:**
 * - As a user browsing finished creatives, I want each output record to show the product, format,
 *   file location, and completion state so I can review deliverables quickly.
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
