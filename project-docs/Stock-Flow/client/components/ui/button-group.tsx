import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch gap-2 rounded-xl",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },

      variant: {
        default:
          "bg-muted text-foreground border px-4 py-2",

        /* ✅ ACCEPT GROUP */
        accept:
          "bg-green-600 text-white border border-green-600 hover:bg-green-500 transition-all duration-300",

        /* ❌ REJECT GROUP */
        reject:
          "bg-red-600 text-white border border-red-600 hover:bg-red-500 transition-all duration-300",
      },
    },

    defaultVariants: {
      orientation: "horizontal",
      variant: "default",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation, variant }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 border px-4 py-2 text-sm font-medium rounded-xl bg-muted",
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "bg-input self-stretch data-[orientation=vertical]:h-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
