/**
 * Metadata for a specific product featured in a campaign.
 */
export interface Product {
  /** Unique stable identifier for the product. */
  id: string;
  /** The name of the product. */
  name: string;
  /** A textual description used for AI prompt generation. */
  description: string;
  /** Optional URL to an existing image asset to skip AI generation. */
  existingAsset?: string;
}
