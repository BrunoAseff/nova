import { type HTMLMotionProps, motion } from "motion/react";
import { forwardRef } from "react";
import { duration } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-[var(--accent-hover)]",
  secondary:
    "bg-[var(--fill-hover)] text-ink hover:bg-[var(--fill-active)] shadow-[inset_0_0_0_1px_var(--hairline)]",
  ghost: "text-ink-2 hover:bg-[var(--fill-hover)] hover:text-ink",
  danger: "text-danger hover:bg-[color-mix(in_oklab,var(--danger)_12%,transparent)]",
};

/** Alturas fixas: todos os controles de uma linha se alinham pela mesma régua. */
const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-[0.8125rem] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[0.9375rem] gap-2",
};
const ICON_SIZE: Record<Size, string> = { sm: "size-8", md: "size-10", lg: "size-12" };

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  /** Botão só com ícone: quadrado e redondo. Exige `aria-label`. */
  icon?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", icon = false, className, type = "button", ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: duration.quick }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full leading-none font-medium whitespace-nowrap transition-colors duration-150 select-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-[1.15em] [&_svg]:shrink-0",
        VARIANT[variant],
        icon ? cn(ICON_SIZE[size], "px-0") : SIZE[size],
        className,
      )}
      {...props}
    />
  );
});
