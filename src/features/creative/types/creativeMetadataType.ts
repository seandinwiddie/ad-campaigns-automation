/**
 * Contextual information embedded or associated with a generated creative.
 * The metadata records the campaign context used to create a variant so later screens and
 * downstream consumers can trace which message, region, and timestamp produced a given asset.
 *
 * **User Story:**
 * - As a reviewer looking at generated creatives, I want each asset to carry its campaign context
 *   so I can tell what message and region it was created for and when it was generated.
 */
export interface CreativeMetadata {
  /** The campaign message used for the overlay. */
  campaignMessage: string;
  /** The target region specified in the brief. */
  targetRegion: string;
  /** Timestamp of generation in ISO 8601 format. */
  generatedAtIso: string;
}
