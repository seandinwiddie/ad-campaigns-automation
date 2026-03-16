/**
 * Configuration for a specific output aspect ratio.
 * Each entry defines the naming and exact pixel dimensions required to compose a creative
 * variant for one of the supported destination formats.
 *
 * **User Story:**
 * - As the creative pipeline builds size variants, I want each supported format to define its
 *   label and dimensions so outputs are rendered at the correct resolution.
 */
export interface FormatAspectRatio {
  /** Display name for the format (e.g. '9x16 Story'). */
  name: string;
  /** Target width in pixels. */
  width: number;
  /** Target height in pixels. */
  height: number;
  /** String representation of the ratio (e.g. '9:16'). */
  ratio: string;
}
