/**
 * Brand-specific constraints for creative compliance.
 * The structure carries the visual and copy restrictions extracted from the brief so later
 * pipeline stages can check generated assets against the campaign's brand rules.
 *
 * **User Story:**
 * - As a brand manager, I want to provide approved colors and banned words in the brief so generated
 *   campaign assets can be checked automatically for compliance before delivery.
 */
export interface BrandGuidelines {
  /** List of hex colors or color names required by the brand. */
  colors: string[];
  /** Keywords that MUST NOT appear in any generated copy. */
  prohibitedWords: string[];
}
