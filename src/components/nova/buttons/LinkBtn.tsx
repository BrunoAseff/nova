import * as React from "react";
import { cn } from "@/lib/utils";

const LinkBtn = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-lg font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "relative after:absolute after:bottom-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

LinkBtn.displayName = "LinkBtn";

export { LinkBtn };
