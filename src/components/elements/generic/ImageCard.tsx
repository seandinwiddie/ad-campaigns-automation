import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import { Badge } from "./Badge"
import { cn } from "@/common/cn"

interface ImageCardProps extends React.HTMLAttributes<HTMLDivElement> {
    src: string
    alt: string
    title: string
    badgeText?: string
    badgeVariant?: "default" | "secondary" | "destructive" | "outline"
    footer?: React.ReactNode
}

/**
 * Utility component for displaying an image within a themed card.
 * Supports badges for status and footer content for metadata.
 */
function ImageCard({
    src,
    alt,
    title,
    badgeText,
    badgeVariant = "default",
    footer,
    className,
    ...props
}: ImageCardProps) {
    return (
        <Card className={cn("overflow-hidden", className)} {...props}>
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        unoptimized
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}
                {badgeText && (
                    <Badge
                        variant={badgeVariant}
                        className="absolute top-2 right-2 shadow-sm"
                    >
                        {badgeText}
                    </Badge>
                )}
            </div>
            <CardHeader className="p-4">
                <CardTitle className="text-sm font-semibold truncate">
                    {title}
                </CardTitle>
            </CardHeader>
            {footer && <CardContent className="px-4 pb-4 pt-0">{footer}</CardContent>}
        </Card>
    )
}

export { ImageCard }
