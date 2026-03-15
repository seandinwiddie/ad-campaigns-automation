import * as React from "react"

import { cn } from "@/common/cn"

/**
 * The Card component is a flexible container for grouping related content.
 * It provides a consistent background, border, and shadow.
 * 
 * **User Story:**
 * - As a designer, I want a consistent container component to group related 
 *   information like metrics, gallery items, and editor controls.
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *     <CardDescription>Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Main content here.</CardContent>
 * </Card>
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 * @returns {JSX.Element} The rendered Card component.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * The CardHeader component is the top section of the card, typically containing the title and description.
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * The CardTitle component provides a bold heading for the card.
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * The CardDescription component provides secondary text for the card header.
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * The CardAction component is used for placing buttons or other interactive elements in the card header.
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * The CardContent component is the main body section of the card.
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * The CardFooter component is the bottom section of the card, often used for actions or metadata.
 * 
 * @param {React.ComponentProps<"div">} props - The component props.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
