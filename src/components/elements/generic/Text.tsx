import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/common/cn"

const textVariants = cva(
    "transition-colors",
    {
        variants: {
            variant: {
                body: "text-base leading-7",
                muted: "text-sm text-muted-foreground",
                label: "text-sm font-medium leading-none",
                mono: "font-mono text-sm bg-muted px-[0.3rem] py-[0.1rem] rounded",
                bold: "font-semibold",
                tabular: "tabular-nums",
            },
        },
        defaultVariants: {
            variant: "body",
        },
    }
)

interface TextProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {
    as?: "span" | "p" | "div" | "label"
}

function Text({ className, variant, as, ...props }: TextProps) {
    const Component = as || (variant === "body" ? "p" : "span")
    return (
        <Component
            className={cn(textVariants({ variant, className }))}
            {...props}
        />
    )
}

export { Text, textVariants }
