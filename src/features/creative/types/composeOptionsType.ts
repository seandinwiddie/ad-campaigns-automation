/**
 * Options for customizing the text overlay composition.
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
