/**
 * Metadata for a specific product featured in a campaign.
 * Each product entry supplies the minimum information needed to either locate an existing image
 * or generate a new one and then compose campaign creatives around that product.
 *
 * **User Story:**
 * - As a marketer adding products to a campaign brief, I want each product to include its identity,
 *   description, and optional existing image so the pipeline knows how to build creatives for it.
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
