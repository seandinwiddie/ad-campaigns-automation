import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/common/cn"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * The Badge component is a small label used to highlight a status or category.
 * It comes in several variants: default, secondary, destructive, and outline.
 * 
 * **User Story:**
 * - As a user, I want subtle visual indicators for product statuses (pending, completed, failed) 
 *   so I can quickly understand the state of the pipeline at a glance.
 * 
 * @example
 * <Badge variant="secondary">In Progress</Badge>
 * 
 * @param {React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>} props - The component props.
 * @returns {JSX.Element} The rendered Badge component.
 */
function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
