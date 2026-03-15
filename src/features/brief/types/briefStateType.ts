import type { CampaignBrief } from './campaignBriefType';
import type { ValidationError } from './validationErrorType';

/**
 * Redux state for managing the campaign brief input and validation.
 */
export interface BriefState {
  /** The parsed and validated campaign brief data. */
  brief: CampaignBrief | null;
  /** True if the current input satisfies all schema requirements. */
  isValid: boolean;
  /** List of issues found during parsing or validation. */
  validationErrors: ValidationError[];
  /** True when the brief is being parsed or remote data is being fetched. */
  loading: boolean;
  /** Global error message for the brief feature. */
  error: string | null;
}
