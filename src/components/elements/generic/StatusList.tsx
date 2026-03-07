import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, Loader2, AlertCircle } from "lucide-react"

interface StatusListItemProps extends React.HTMLAttributes<HTMLDivElement> {
    status: "idle" | "running" | "complete" | "error"
    label: string
    description?: string
    isHighlighted?: boolean
}

function StatusListItem({
    status,
    label,
    description,
    isHighlighted = false,
    className,
    ...props
}: StatusListItemProps) {
    const Icon = {
        idle: () => <div className="h-4 w-4 rounded-full border-2 border-muted" />,
        running: () => <Loader2 className="h-4 w-4 animate-spin text-primary" />,
        complete: () => <Check className="h-4 w-4 text-green-500" />,
        error: () => <AlertCircle className="h-4 w-4 text-destructive" />,
    }[status]

    return (
        <div
            className={cn(
                "flex items-start gap-3 rounded-lg p-3 transition-colors",
                isHighlighted ? "bg-accent/50 border border-accent" : "bg-transparent",
                className
            )}
            {...props}
        >
            <div className="mt-0.5">
                <Icon />
            </div>
            <div className="space-y-1">
                <p
                    className={cn(
                        "text-sm font-medium leading-none",
                        status === "running" ? "text-primary" : "text-foreground"
                    )}
                >
                    {label}
                </p>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    )
}

interface StatusListProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

function StatusList({ children, className, ...props }: StatusListProps) {
    return (
        <div className={cn("space-y-1", className)} {...props}>
            {children}
        </div>
    )
}

export { StatusList, StatusListItem }
