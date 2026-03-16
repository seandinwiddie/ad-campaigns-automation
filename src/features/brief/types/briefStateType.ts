/**
 * Defines the brief feature state that tracks parsed input, validation feedback, and transient loading.
 * It keeps the raw outcome of brief parsing separate from validation diagnostics so the UI can distinguish
 * between a successfully loaded brief, a brief with field errors, and a brief that is still being processed.
 *
 * **User Story:**
 * - As a user entering a campaign brief, I want the app to remember the parsed brief, loading state,
 *   and validation problems together so I can see whether my input is ready or still needs fixes.
 */
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
