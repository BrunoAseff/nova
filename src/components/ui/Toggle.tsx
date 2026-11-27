import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

/**
 * Interruptor. A bolinha desliza por uma transição de CSS num deslocamento fixo (trilho
 * 2,5rem − folga 0,25rem − bolinha 1,25rem = 1rem).
 *
 * A cor de "ligado" é uma camada por cima do trilho que esmaece por opacidade, não uma
 * transição de `background-color`. O Chrome roda transições de cor de fundo na GPU e, ao
 * devolver o valor final, às vezes desenha um quadro com a cor inicial: o switch piscava
 * de volta para o estado anterior, uma ou duas vezes por clique (gravado quadro a quadro
 * numa janela do Chrome com GPU; o estilo calculado da página nunca voltava). Opacidade
 * não tem esse problema.
 *
 * Anima mesmo com "reduzir movimento": é um deslize curto, no lugar, que mostra o estado.
 */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative flex h-6 w-10 shrink-0 items-center rounded-full bg-[var(--fill-active)] p-0.5"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-full bg-accent transition-opacity duration-200",
          checked ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative block size-5 rounded-full bg-white shadow-[0_1px_3px_oklch(0%_0_0/0.25)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
