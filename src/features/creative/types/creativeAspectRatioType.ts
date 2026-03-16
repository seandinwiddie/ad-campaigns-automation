/**
 * Supported aspect ratios for generated creatives.
 * This union narrows every creative variant to the approved ratio set used throughout
 * composition, persistence, progress tracking, and results rendering.
 *
 * **User Story:**
 * - As the app creates campaign variants, I want aspect ratios limited to the supported set
 *   so each product is generated only in the formats the pipeline knows how to handle.
 */
export type CreativeAspectRatio = '1:1' | '16:9' | '9:16';
