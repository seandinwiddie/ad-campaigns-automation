import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
    "font-bold tracking-tight text-foreground",
    {
        variants: {
            variant: {
                h1: "text-4xl lg:text-5xl",
                h2: "text-3xl scroll-m-20 border-b pb-2 transition-colors first:mt-0",
                h3: "text-2xl scroll-m-20",
                h4: "text-xl scroll-m-20",
            },
        },
        defaultVariants: {
            variant: "h1",
        },
    }
)

interface HeadingProps
    extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

function Heading({ className, variant, as, ...props }: HeadingProps) {
    const Component = as || variant || "h1"
    return (
        <Component
            className={cn(headingVariants({ variant, className }))}
            {...props}
        />
    )
}

export { Heading, headingVariants }
