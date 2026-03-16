/**
 * Central registry of the output formats the pipeline composes for each generated campaign asset.
 * This constant is the single source of truth for which aspect ratios the system must render,
 * which dimensions they require, and how those variants are labeled across the workflow.
 *
 * **User Story:**
 * - As a campaign operator, I want every product rendered in the supported ad formats so the pipeline
 *   consistently produces the size variants needed for downstream channels.
 */
import type { FormatAspectRatio } from '../types/formatAspectRatioType';

/**
 * Standard aspect ratios supported by the creative generation pipeline.
 * Each entry defines the target dimensions and label for ad platforms.
 */
export const ASPECT_RATIOS: readonly FormatAspectRatio[] = [
  { name: '1x1', width: 1080, height: 1080, ratio: '1:1' },
  { name: '9x16', width: 1080, height: 1920, ratio: '9:16' },
  { name: '16x9', width: 1920, height: 1080, ratio: '16:9' },
] as const;
