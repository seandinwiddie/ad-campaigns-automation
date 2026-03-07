import type { CampaignBrief } from './campaignBriefType';
import type { ValidationError } from './validationErrorType';

export interface BriefState {
  brief: CampaignBrief | null;
  isValid: boolean;
  validationErrors: ValidationError[];
  loading: boolean;
  error: string | null;
}
