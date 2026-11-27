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
  control = false,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children?: ReactNode;
  /**
   * A linha aciona o controle dentro dela (ex.: um Toggle): clicar no texto liga e
   * desliga. Sem `<label>`: um <label> em volta de um <button> repassa o clique ao botão
   * por conta própria, e isso varia entre navegadores (o switch podia receber dois
   * cliques e piscar entre ligado e desligado). Aqui o repasse é explícito e só acontece
   * quando o clique não caiu em nenhum controle.
   */
  control?: boolean;
}) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: atalho de mouse; o controle dentro já é acessível pelo teclado
    // biome-ignore lint/a11y/useKeyWithClickEvents: idem
    <div
      onClick={
        control
          ? (event) => {
              const target = event.target as Element;
              if (target.closest("button, a, input, select, textarea, [role=switch]")) return;
              event.currentTarget
                .querySelector<HTMLElement>("[role=switch], button, input")
                ?.click();
            }
          : undefined
      }
      className={cn(
        "flex min-h-12 items-center justify-between gap-4 py-2",
        control && "cursor-pointer select-none",
      )}
    >
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
