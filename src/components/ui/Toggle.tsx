import { motion } from "motion/react";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
        checked ? "justify-end bg-accent" : "justify-start bg-[var(--fill-active)]",
      )}
    >
      <motion.span
        layout
        transition={glide}
        className="block size-5 rounded-full bg-white shadow-[0_1px_3px_oklch(0%_0_0/0.25)]"
      />
    </button>
  );
}
