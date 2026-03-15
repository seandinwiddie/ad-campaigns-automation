"use client"

import * as React from "react"

import { cn } from "@/common/cn"

/**
 * The Table component provides a structured way to display data in rows and columns.
 * It is wrapped in a responsive container to handle overflow on small screens.
 * 
 * **User Story:**
 * - As a user, I want a clear tabular view of complex data like compliance reports 
 *   or product statuses so I can easily scan for important information.
 * 
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>EcoBottle</TableCell>
 *       <TableCell>Completed</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * 
 * @param {React.ComponentProps<"table">} props - The component props.
 * @returns {JSX.Element} The rendered Table component.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

/**
 * The TableHeader component represents the header section (thead) of the table.
 * 
 * @param {React.ComponentProps<"thead">} props - The component props.
 */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

/**
 * The TableBody component represents the main content section (tbody) of the table.
 * 
 * @param {React.ComponentProps<"tbody">} props - The component props.
 */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

/**
 * The TableFooter component represents the footer section (tfoot) of the table.
 * 
 * @param {React.ComponentProps<"tfoot">} props - The component props.
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * The TableRow component represents a single row (tr) in the table.
 * 
 * @param {React.ComponentProps<"tr">} props - The component props.
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

/**
 * The TableHead component represents a header cell (th) in the table.
 * 
 * @param {React.ComponentProps<"th">} props - The component props.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * The TableCell component represents a standard data cell (td) in the table.
 * 
 * @param {React.ComponentProps<"td">} props - The component props.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

/**
 * The TableCaption component provides a summary or title for the table.
 * 
 * @param {React.ComponentProps<"caption">} props - The component props.
 */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
