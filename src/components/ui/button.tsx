import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-foreground w-fit transition-all rounded-xl hover:bg-secondary text-background p-5 font-sans text-sm font-[600]",
        destructive:
          "bg-muted-foreground w-fit transition-all rounded-xl hover:bg-destructive hover:text-foreground text-background p-5 font-sans text-sm font-[600]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-accent w-fit transition-all rounded-xl hover:bg-foreground hover:text-background text-foreground p-5 font-sans text-sm font-[600]",
        ghost:
          "w-fit transition-all rounded-xl hover:bg-accent hover:text-accent-foreground  p-5 font-sans text-sm font-[500] border-[1px] hover:border-secondary hover:text-secondary hover:bg-secondary-smooth-700/10 border-muted-foreground/80 text-muted-foreground/80",
        link: "text-primary underline-offset-4 hover:underline",
        icon: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
