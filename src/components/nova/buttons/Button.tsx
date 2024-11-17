import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default:
    "bg-transparent border-[1px] border-transparent hover:border-secondary text-foreground hover:text-secondary hover:bg-blue-700/10",
  secondary:
    "bg-transparent border-[1px] border-transparent hover:border-secondary text-foreground hover:text-secondary hover:bg-blue-700/10",
  fill: "bg-transparent border-[1px] border-transparent hover:border-secondary text-foreground hover:text-secondary hover:bg-blue-700/10",
  destructive:
    "rounded-full border-[1px] border-transparent bg-transparent text-foreground hover:border-destructive hover:bg-red-700/20 hover:text-destructive",
};

type ButtonProps = {
  variant?: keyof typeof buttonVariants;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "text-md inline-flex items-center justify-center rounded-full px-6 py-3 font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps };
