/**
 * Options for customizing the text overlay composition.
 * The type isolates optional styling knobs for creative rendering so composition logic can accept
 * configurable presentation choices without coupling them to unrelated creative state.
 *
 * **User Story:**
 * - As a designer tuning generated ad variants, I want configurable overlay options so text can be
 *   positioned and styled appropriately for different campaign formats.
 */
export interface ComposeOptions {
  /** Size of the text in pixels. */
  fontSize?: number;
  /** Color of the text in hex format. */
  fontColor?: string;
  /** Vertical alignment of the text on the image. */
  position?: 'top' | 'center' | 'bottom';
  /** Whether to apply a drop shadow to the text for readability. */
  shadow?: boolean;
}
