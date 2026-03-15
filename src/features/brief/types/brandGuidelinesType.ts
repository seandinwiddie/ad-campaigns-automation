/**
 * Brand-specific constraints for creative compliance.
 */
export interface BrandGuidelines {
  /** List of hex colors or color names required by the brand. */
  colors: string[];
  /** Keywords that MUST NOT appear in any generated copy. */
  prohibitedWords: string[];
}
