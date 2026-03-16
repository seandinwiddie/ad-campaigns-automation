/**
 * Detailed information about a validation failure in the campaign brief.
 * The shape preserves both the field path and the human-readable explanation so UI surfaces
 * can point users directly to the part of the brief that needs correction.
 *
 * **User Story:**
 * - As a user fixing an invalid campaign brief, I want each validation issue to identify the bad field
 *   and explain the problem so I can correct the input without guesswork.
 */
export interface ValidationError {
  /** The key or path in the brief where the error originated. */
  field: string;
  /** Human-readable description of why the value is invalid. */
  message: string;
}
