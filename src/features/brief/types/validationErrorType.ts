/**
 * Detailed information about a validation failure in the campaign brief.
 */
export interface ValidationError {
  /** The key or path in the brief where the error originated. */
  field: string;
  /** Human-readable description of why the value is invalid. */
  message: string;
}
