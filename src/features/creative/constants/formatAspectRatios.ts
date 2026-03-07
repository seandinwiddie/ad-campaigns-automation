import type { FormatAspectRatio } from '../types/formatAspectRatioType';

export const ASPECT_RATIOS: readonly FormatAspectRatio[] = [
  { name: '1x1', width: 1080, height: 1080, ratio: '1:1' },
  { name: '9x16', width: 1080, height: 1920, ratio: '9:16' },
  { name: '16x9', width: 1920, height: 1080, ratio: '16:9' },
] as const;
