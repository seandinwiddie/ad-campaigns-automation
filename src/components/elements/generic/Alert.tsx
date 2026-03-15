import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/common/cn"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * The Alert component is used to display important messages to the user.
 * It provides a visual container for alerts with different variants like default or destructive.
 * 
 * **User Story:**
 * - As a user, I want important system notifications (success, errors, warnings) 
 *   to be highlighted in a distinct container so I don't miss them.
 * 
 * @example
 * <Alert variant="default">
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>This is a default alert message.</AlertDescription>
 * </Alert>
 * 
 * @param {React.ComponentProps<"div"> & VariantProps<typeof alertVariants>} props - The component props.
 * @returns {JSX.Element} The rendered Alert component.
 */
function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

/**
 * The AlertTitle component is used to provide a heading for the alert message.
 * It ensures proper styling and alignment within the Alert container.
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 * @returns {JSX.Element} The rendered AlertTitle component.
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className)}
      {...props}
    />
  )
}

/**
 * The AlertDescription component is used to provide the main content of the alert.
 * It is typically placed after the AlertTitle.
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 * @returns {JSX.Element} The rendered AlertDescription component.
 */
function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
