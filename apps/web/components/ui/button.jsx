import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border border-primary/20 hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-border/80 bg-background text-foreground/70 hover:text-foreground hover:bg-muted hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 px-5 rounded-xl text-xs font-bold uppercase tracking-wider",
        xs: "h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider",
        sm: "h-9 px-4 rounded-xl text-xs font-medium",
        lg: "h-14 px-8 rounded-full text-xs font-black uppercase tracking-widest",
        xl: "h-16 px-10 rounded-[2rem] text-sm font-black uppercase tracking-widest",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  ...props
}, ref) => {
  return (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
