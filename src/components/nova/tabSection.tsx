/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tabSectionVariants = cva("grid w-full grid-cols-1", {
  variants: {
    background: {
      true: "border-accent/20 bg-accent-foreground rounded-2xl border-[1px] p-4",
      false: "",
    },
    variant: {
      default: "",
      danger: "border-destructive bg-destructive/10",
    },
    scroll: {
      true: "scrollbar-thin scrollbar-track-background scrollbar-thumb-accent overflow-y-auto",
      false: "overflow-hidden",
    },
  },
  compoundVariants: [
    {
      background: true,
      variant: "danger",
      className:
        "border-destructive bg-destructive/10 rounded-2xl border-[1px] p-4",
    },
  ],
  defaultVariants: {
    background: false,
    variant: "default",
    scroll: false,
  },
});

export interface TabSectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof tabSectionVariants> {
  maxHeight?: string;
  isScrollable?: boolean;
  hasBackground?: boolean;
}

const TabSection = React.forwardRef<HTMLElement, TabSectionProps>(
  (
    {
      className,
      maxHeight = "100%",
      isScrollable = false,
      hasBackground = true,
      variant,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          tabSectionVariants({
            background: hasBackground,
            variant,
            scroll: isScrollable,
            className,
          }),
        )}
        style={{ maxHeight: isScrollable ? maxHeight : undefined }}
        {...props}
      >
        {children}
      </section>
    );
  },
);

TabSection.displayName = "TabSection";

export { TabSection, tabSectionVariants };

// if has background border-accent/20 bg-accent-foreground rounded-2xl border-[1px] p-4
// if variang danger and has background border-destructive bg-destructive/10 rounded-2xl border-[1px] p-4
// if isScrollable scrollbar-thin scrollbar-track-background scrollbar-thumb-accent and will have scroll after maxHeight
