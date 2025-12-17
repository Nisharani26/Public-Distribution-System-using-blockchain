import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-xl",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border",

        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border",

        outline:
          "border [border-color:var(--button-outline)] bg-transparent",

        secondary:
          "bg-secondary text-secondary-foreground border border-secondary-border",

        ghost:
          "bg-transparent border border-transparent",

        link:
          "text-primary underline-offset-4 hover:underline",

        /* ✅ ACCEPT BUTTON */
        accept:
          "bg-green-600 text-white border border-green-600 hover:bg-green-500 hover:scale-[1.03]",

        /* ❌ REJECT BUTTON */
        reject:
          "bg-red-600 text-white border border-red-600 hover:bg-red-500 hover:scale-[1.03]",
      },

      size: {
        default: "h-12 px-6 text-base",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
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
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }

