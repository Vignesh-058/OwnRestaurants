import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
 "inline-flex items-center rounded-lg border px-3 py-1 text-[13px] font-bold transition-all duration-300 focus:outline-none",
 {
 variants: {
 variant: {
 default:
 "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
 secondary:
 "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
 destructive:
 "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
 outline: "text-foreground",
 },
 },
 defaultVariants: {
 variant: "default",
 },
 }
)

export interface BadgeProps
 extends React.HTMLAttributes<HTMLDivElement>,
 VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
 return (
 <div className={cn(badgeVariants({ variant }), className)} {...props} />
 )
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
