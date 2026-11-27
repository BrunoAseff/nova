import { AnimatePresence, motion } from "motion/react";
import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";
import type { PlacedWidget, WidgetSize } from "@/content/widgets";
import { Breathing } from "@/features/breathing/Breathing";
import { Clock } from "@/features/clock/Clock";
import { Pomodoro } from "@/features/pomodoro/Pomodoro";
import { Quote } from "@/features/quote/Quote";
import { Reminders } from "@/features/reminders/Reminders";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SIZE_STEP } from "@/lib/widgetSize";
import { useAttentionStore } from "@/stores/attention";
import { type Space, useSpacesStore } from "@/stores/spaces";
import { compactOrder, compactSize } from "./layout/compact";

/** Instrumentos (com vidro e controles) que no celular deitado ficam sempre no tamanho S. */
const INSTRUMENTS: readonly PlacedWidget[] = ["pomodoro", "breathing"];

/** Distância mínima, em px, para um deslize trocar de espaço. */
const SWIPE = 56;
/** Faixa de baixo onde fica o dock: o que rola para lá esmaece antes de passar por ele. */
const DOCK_BAND = 88;
/** Quanto de um widget ainda à vista, em px, até ele esmaecer de todo. */
const EDGE = 140;

/**
 * O palco no celular (fundamentos de design, "Composição"). Em pé (`column`), os widgets
 * empilham numa coluna centralizada, o principal no topo; se não couberem, a coluna rola.
 * Deitado (`row`), só há altura para dois: o principal e o seguinte, lado a lado.
 *
 * A ordem e os tamanhos são os do celular (`space.compact`), à parte da grade. Nenhum
 * widget passa da largura do seu lugar (`--fit`). Trocar de tamanho anima o `--k` por CSS.
 *
 * Deslizar para os lados troca de espaço, mas só começando fora de um widget: assim
 * mexer num widget nunca troca de espaço sem querer.
 */
export function CompactStage({ space, mode }: { space: Space; mode: "column" | "row" }) {
  const arranging = useAttentionStore((s) => s.arranging);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // A coluna rola até a borda da tela (sem uma linha de corte no meio da cena). O widget
  // que vai saindo, pelo alto ou chegando no dock, esmaece conforme sobra menos dele à
  // vista. Sem máscara: uma máscara num ancestral apagaria o desfoque do vidro; o
  // `--edge-fade` é aplicado só pelas folhas (`.fade`), como os outros esmaecimentos.
  useLayoutEffect(() => {
    const box = scroller.current;
    if (!box || mode !== "column") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const view = box.getBoundingClientRect();
      const bottom = view.bottom - DOCK_BAND;
      for (const item of box.querySelectorAll<HTMLElement>("[data-widget]")) {
        const rect = item.getBoundingClientRect();
        // Um widget baixo esmaece desde que começa a sair; um alto, só nos últimos 140px.
        const room = Math.min(EDGE, rect.height);
        const shown = Math.min(rect.bottom - view.top, bottom - rect.top);
        const fade = Math.max(0, Math.min(1, shown / room));
        item.style.setProperty("--edge-fade", fade.toFixed(3));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    box.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(box);
    if (box.firstElementChild) observer.observe(box.firstElementChild);
    return () => {
      box.removeEventListener("scroll", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [mode]);
  const all = compactOrder(space);
  const order = mode === "row" ? all.slice(0, 2) : all;

  const sizeOf = (id: PlacedWidget): WidgetSize => {
    const size = compactSize(space, id);
    if (mode !== "row") return size;
    if (INSTRUMENTS.includes(id)) return "s";
    return size === "l" ? "m" : size;
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest("[data-widget]")) return;
    swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const { spaces, setActiveSpace } = useSpacesStore.getState();
    const index = spaces.findIndex((s) => s.id === space.id);
    const next = spaces[index + (dx < 0 ? 1 : -1)];
    if (next) setActiveSpace(next.id);
  };

  return (
    <div
      ref={scroller}
      className={cn(
        "size-full touch-pan-y overscroll-contain",
        mode === "column" ? "overflow-y-auto" : "overflow-hidden",
      )}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipe.current = null;
      }}
    >
      <div
        className={cn(
          // As margens ficam aqui dentro: a rolagem vai até a borda da tela.
          "flex min-h-full items-center justify-center px-[clamp(1.5rem,4vw,4rem)] pt-[clamp(1.5rem,5vh,4rem)] pb-[calc(clamp(1rem,3vh,2rem)+5.5rem)]",
          mode === "column" ? "flex-col gap-10" : "flex-row gap-8",
        )}
      >
        <AnimatePresence initial={false}>
          {order.map((id) => (
            <motion.div
              key={id}
              data-widget={id}
              layout="position"
              className={cn(
                "compact-item @container flex justify-center",
                mode === "column" ? "w-full" : "min-w-0 flex-1",
              )}
              // `100cqw`, não `100%`: a largura do item é sempre definida, e dentro de um
              // widget que toma a largura do conteúdo um `100%` desabava (o orbe virava 88px).
              style={{ "--k": SIZE_STEP[sizeOf(id)], "--fit": "100cqw" } as CSSProperties}
              initial={{ "--item-fade": 0, scale: 0.96 }}
              animate={{ "--item-fade": 1, scale: 1 }}
              exit={{ "--item-fade": 0, scale: 0.96 }}
              transition={{ duration: duration.calm, ease: ease.out }}
            >
              <div inert={arranging} className="flex max-w-full justify-center">
                {render(space, id)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function render(space: Space, id: PlacedWidget): ReactNode {
  const widgets = space.widgets;
  switch (id) {
    case "clock":
      return <Clock format={widgets.clock.format} align="center" />;
    case "pomodoro":
      return <Pomodoro />;
    case "breathing":
      return <Breathing technique={widgets.breathing.technique} />;
    case "quote":
      return <Quote align="center" />;
    case "reminders":
      return <Reminders align="center" />;
  }
}
