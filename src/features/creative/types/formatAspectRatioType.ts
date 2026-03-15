/**
 * Configuration for a specific output aspect ratio.
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
