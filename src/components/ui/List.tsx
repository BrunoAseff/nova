import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Grupo de linhas com separador fino entre elas. Nunca um card dentro de outro. */
export function List({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col divide-y divide-[var(--hairline)]", className)}>
      {children}
    </div>
  );
}

export function Row({
  label,
  hint,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 py-2">
      <div className="flex min-w-0 flex-col">
        <span className="text-[0.9375rem] text-ink">{label}</span>
        {hint && <span className="text-[0.8125rem] text-ink-3">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-1 text-[0.8125rem] font-medium text-ink-3">{children}</h3>;
}
