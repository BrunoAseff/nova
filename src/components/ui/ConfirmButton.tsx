import { animate } from "motion/react";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./Button";

interface ConfirmButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** O que o botão mostra antes de pedir confirmação (ex.: um ícone). */
  children: ReactNode;
  /** Texto do segundo passo, ex.: "Reset?" ou "Delete". */
  confirmLabel: string;
  onConfirm: () => void;
}

const LABEL = "flex items-center gap-2 transition-[opacity,filter] duration-150";
const HIDDEN = "pointer-events-none absolute inset-0 justify-center opacity-0 blur-[3px]";

/**
 * Ação destrutiva em dois toques, sem diálogo que quebre o clima: o primeiro toque
 * transforma o botão no pedido de confirmação; se nada acontecer em 3s, ele volta.
 *
 * Os dois rótulos ficam sempre montados, um por cima do outro e centrados: o ativo ocupa
 * o espaço, o outro fica fora do fluxo e esmaece. Nada sai voando quando o botão cresce
 * (antes, o ícone que saía ficava preso à borda esquerda, que andava com a largura).
 * A largura anima entre as duas medidas, lidas com `offsetWidth` (sem transforms).
 */
export function ConfirmButton({
  children,
  confirmLabel,
  onConfirm,
  icon,
  variant = "secondary",
  className,
  ...props
}: ConfirmButtonProps) {
  const [asking, setAsking] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  /** Largura de antes da troca, lida no momento da troca. */
  const from = useRef<number | null>(null);

  const change = (next: boolean) => {
    if (next === asking) return;
    from.current = button.current?.offsetWidth ?? null;
    setAsking(next);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: anima só quando o rótulo troca
  useLayoutEffect(() => {
    const element = button.current;
    const start = from.current;
    from.current = null;
    if (!element || start === null) return;
    // Direto no elemento, e limpo no fim: um `width: auto` em linha venceria o tamanho
    // fixo do botão de ícone (size-8) e o deixaria estreito.
    element.style.width = "";
    const to = element.offsetWidth;
    element.style.width = `${start}px`;
    const animation = animate(start, to, {
      duration: duration.base,
      ease: ease.out,
      onUpdate: (value) => {
        element.style.width = `${value}px`;
      },
    });
    animation.then(() => {
      element.style.width = "";
    });
    return () => animation.stop();
  }, [asking]);

  useEffect(() => {
    if (!asking) return;
    const timer = window.setTimeout(() => change(false), 3000);
    return () => window.clearTimeout(timer);
  });

  return (
    <Button
      ref={button}
      variant={asking ? "danger" : variant}
      icon={asking ? false : icon}
      onClick={() => {
        if (asking) {
          change(false);
          onConfirm();
        } else change(true);
      }}
      onBlur={() => change(false)}
      data-asking={asking}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <span aria-hidden={asking} className={cn(LABEL, asking && HIDDEN)}>
        {children}
      </span>
      <span aria-hidden={!asking} className={cn(LABEL, !asking && HIDDEN)}>
        {confirmLabel}
      </span>
    </Button>
  );
}
