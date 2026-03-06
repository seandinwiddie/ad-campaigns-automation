import type { Creative } from './creativeType';

export interface CreativeState {
  creatives: Record<string, Creative>;
  completedCount: number;
  totalCount: number;
  progressPct: number;
}
