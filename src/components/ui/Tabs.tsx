import { motion } from "motion/react";
import { type ReactNode, useId } from "react";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useRovingGroup } from "./useRovingGroup";

export interface TabOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface TabsProps<T extends string> {
  options: readonly TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
  /** Ocupa a largura toda, com as opções divididas por igual. */
  full?: boolean;
}

/**
 * Escolha entre poucas opções sempre visíveis. O fundo da opção ativa desliza entre
 * elas (mola sem quique), em vez de piscar de um lugar para o outro.
 */
export function Tabs<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className,
  full = false,
}: TabsProps<T>) {
  const id = useId();
  const roving = useRovingGroup(
    options.map((o) => o.value),
    value,
    onChange,
  );
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "relative flex items-center rounded-full bg-[var(--fill-hover)] p-1 shadow-[inset_0_0_0_1px_var(--hairline)]",
        full && "w-full",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          // biome-ignore lint/a11y/useSemanticElements: opção visual de um radiogroup (padrão ARIA)
          <button
            key={option.value}
            {...roving(option.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200 focus-visible:z-10",
              size === "md" ? "h-9 px-4 text-sm" : "h-7 px-3 text-[0.8125rem]",
              full && "flex-1",
              selected ? "text-ink" : "text-ink-2 hover:text-ink",
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-indicator`}
                className="absolute inset-0 rounded-full bg-[var(--fill-selected)] shadow-[var(--fill-selected-shadow)]"
                transition={glide}
              />
            )}
            <span className="relative flex items-center gap-2 [&_svg]:size-4">
              {option.icon}
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
