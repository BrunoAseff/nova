import { type AnimationPlaybackControls, animate } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion";

/**
 * Bloco cuja altura acompanha o conteúdo animando, em vez de pular: quando o que está
 * dentro muda de tamanho (um texto trocado por outro mais alto, uma linha que entra), a
 * altura vai da antiga à nova. Quem está embaixo desliza junto, e um popover ancorado
 * acompanha quadro a quadro.
 *
 * A altura é escrita direto no elemento, no mesmo instante da medida. Com um MotionValue
 * ela só chegava à tela no quadro seguinte, e o primeiro quadro saía com a altura nova
 * inteira (o widget pulava e voltava).
 *
 * Corta o conteúdo só enquanto anima, e só na vertical (parado, sombras e anéis de foco
 * não são cortados; dos lados, nunca).
 * O que sai deve sair do fluxo (`AnimatePresence mode="popLayout"`), senão a altura
 * durante a troca é a soma dos dois.
 */
export function AutoHeight({ children, className }: { children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = outer.current;
    const content = inner.current;
    if (!box || !content) return;
    let last = content.offsetHeight;
    let current = last;
    let animation: AnimationPlaybackControls | undefined;
    const settle = () => {
      box.style.height = "";
      box.style.overflowY = "";
    };
    const observer = new ResizeObserver(() => {
      const next = content.offsetHeight;
      if (next === last) return;
      const from = animation ? current : last;
      last = next;
      animation?.stop();
      box.style.height = `${from}px`;
      // Corta só na vertical: `hidden` cortaria também dos lados, e o que sai (mais largo
      // que o que entra) aparecia cortado. `clip` permite um eixo de cada jeito.
      box.style.overflowY = "clip";
      animation = animate(from, next, {
        duration: duration.base,
        ease: ease.out,
        onUpdate: (value) => {
          current = value;
          box.style.height = `${value}px`;
        },
        onComplete: () => {
          animation = undefined;
          settle();
        },
      });
    });
    observer.observe(content);
    return () => {
      observer.disconnect();
      animation?.stop();
      settle();
    };
  }, []);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="relative flow-root">
        {children}
      </div>
    </div>
  );
}
