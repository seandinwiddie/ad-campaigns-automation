/**
 * Contextual information embedded or associated with a generated creative.
 */
export interface CreativeMetadata {
  /** The campaign message used for the overlay. */
  campaignMessage: string;
  /** The target region specified in the brief. */
  targetRegion: string;
  /** Timestamp of generation in ISO 8601 format. */
  generatedAtIso: string;
}
