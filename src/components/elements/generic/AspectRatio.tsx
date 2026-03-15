"use client"

/**
 * AspectRatio component maintains a fixed ratio for its children.
 * Useful for images and video containers.
 * 
 * **User Story:**
 * - As a designer, I want to ensure ad creatives maintain their intended 
 *   proportions (e.g. 1:1, 16:9) across different screen sizes.
 */
import { AspectRatio as AspectRatioPrimitive } from "radix-ui"

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
