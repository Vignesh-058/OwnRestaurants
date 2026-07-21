import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[15px] font-semibold transition-all duration-300 active:scale-[0.97] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-dark",
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-dark",
        secondary:
          "bg-primary-light text-primary border border-primary-light shadow-sm hover:brightness-95",
        outline:
          "border-2 border-primary bg-background text-primary shadow-sm hover:bg-primary/5",
        ghost: "hover:bg-primary/10 hover:text-primary transition-colors",
        text: "text-primary hover:bg-primary-light/50",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground shadow-sm hover:bg-success/90",
        danger: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 text-[13px]",
        lg: "h-14 px-8 text-[16px]",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
 VariantProps<typeof buttonVariants> {
 asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, asChild = false, ...props }, ref) => {
 const Comp = asChild ? Slot : "button"
 return (
 <Comp
 className={cn(buttonVariants({ variant, size, className }))}
 ref={ref}
 {...props}
 />
 )
 }
)
Button.displayName = "Button"

// eslint-disable-next-line react-refresh/only-export-components
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
