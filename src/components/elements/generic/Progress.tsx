"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/common/cn"

/**
 * Visual progress indicator using Radix UI primitives.
 * Provides accessible labels for screen readers.
 * 
 * **User Story:**
 * - As a user, I want a visual progress bar during long-running tasks 
 *   so I can see that the application is still working and estimate time remaining.
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const hasAccessibleName =
    typeof props['aria-label'] === 'string' && props['aria-label'].trim().length > 0;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
      aria-label={hasAccessibleName ? props['aria-label'] : 'Progress'}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
