import type { RootState } from '@/app/store';

export const selectCreatives = (state: RootState) => state.creative.creatives;
export const selectCreativeProgress = (state: RootState) => state.creative.progressPct;
export const selectCompletedCount = (state: RootState): number => state.creative.completedCount;
export const selectTotalCount = (state: RootState): number => state.creative.totalCount;
export const selectAllCreatives = (state: RootState) => state.creative.creatives;
