import { animate, type MotionValue, motion } from "motion/react";
import { type KeyboardEvent, type PointerEvent, type RefObject, useRef, useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import {
  PLACED_WIDGET_LABEL,
  type Place,
  type PlacedWidget,
  type WidgetSize,
} from "@/content/widgets";
import { duration, ease, glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { anchorOf, findFreeSpot, placeFromRect, type Rect, rectFor, type Size, step } from "./grid";

/** O contorno de onde o widget vai cair, e as guias de alinhamento (em px da área). */
export interface Ghost {
  rect: Rect;
  guides: { x: number[]; y: number[] };
}

const SIZE_OPTIONS = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
] as const;

const KEY_DIRECTION: Record<string, { x: number; y: number }> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};

const same = (a: number, b: number) => Math.abs(a - b) < 1e-6;

/**
 * A alça de um widget no modo de arranjar: um contorno por cima dele que se arrasta (o
 * widget segue o cursor e, ao soltar, prende na grade, no lugar livre mais próximo) ou
 * se move pelas setas (Shift anda três casas). Em cima, os tamanhos S/M/L.
 */
export function ArrangeHandle({
  id,
  place,
  size,
  offset,
  area,
  sizeOf,
  othersOf,
  othersPlaces,
  onGhost,
  onPlace,
  onSize,
}: {
  id: PlacedWidget;
  place: Place;
  size: WidgetSize;
  offset: { x: MotionValue<number>; y: MotionValue<number> };
  area: RefObject<HTMLDivElement | null>;
  sizeOf: () => Size;
  othersOf: () => Rect[];
  othersPlaces: () => Place[];
  onGhost: (ghost: Ghost | null) => void;
  onPlace: (place: Place) => void;
  onSize: (size: WidgetSize) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    startX: number;
    startY: number;
    base: Rect;
    size: Size;
    spot: Place;
    shown: boolean;
  } | null>(null);
  const label = PLACED_WIDGET_LABEL[id];

  const areaSize = (): Size => ({
    width: area.current?.clientWidth ?? 0,
    height: area.current?.clientHeight ?? 0,
  });

  const guidesFor = (spot: Place, areaPx: Size) => {
    const others = othersPlaces();
    const x = new Set<number>();
    const y = new Set<number>();
    if (same(spot.x, 0.5)) x.add(0.5);
    if (same(spot.y, 0.5)) y.add(0.5);
    for (const other of others) {
      if (same(other.x, spot.x)) x.add(spot.x);
      if (same(other.y, spot.y)) y.add(spot.y);
    }
    return {
      x: [...x].map((v) => Math.round(v * areaPx.width)),
      y: [...y].map((v) => Math.round(v * areaPx.height)),
    };
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ponteiro que já não existe (ex.: toque cancelado): segue sem captura.
    }
    const widgetSize = sizeOf();
    drag.current = {
      // Começa de onde o widget está agora (pode estar no meio de uma mola).
      startX: event.clientX - offset.x.get(),
      startY: event.clientY - offset.y.get(),
      base: rectFor(place, widgetSize, areaSize()),
      size: widgetSize,
      spot: place,
      shown: false,
    };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    offset.x.jump(dx);
    offset.y.jump(dy);

    const areaPx = areaSize();
    const loose = { ...current.base, left: current.base.left + dx, top: current.base.top + dy };
    const spot = findFreeSpot(placeFromRect(loose, areaPx), current.size, othersOf(), areaPx);
    // Mesmo lugar de antes: o contorno não muda.
    if (current.shown && same(spot.x, current.spot.x) && same(spot.y, current.spot.y)) return;
    current.spot = spot;
    current.shown = true;
    onGhost({ rect: rectFor(spot, current.size, areaPx), guides: guidesFor(spot, areaPx) });
  };

  const finish = () => {
    const current = drag.current;
    drag.current = null;
    setDragging(false);
    onGhost(null);
    if (!current) return;
    if (same(current.spot.x, place.x) && same(current.spot.y, place.y)) {
      // Voltou para o mesmo ponto: só desliza de volta.
      animate(offset.x, 0, glide);
      animate(offset.y, 0, glide);
      return;
    }
    // O palco faz o FLIP a partir de onde o widget está (base + deslocamento).
    onPlace(current.spot);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction = KEY_DIRECTION[event.key];
    if (!direction) return;
    event.preventDefault();
    const next = step(place, direction, event.shiftKey ? 3 : 1, sizeOf(), othersOf(), areaSize());
    if (next.x !== place.x || next.y !== place.y) onPlace(next);
  };

  // Os tamanhos ficam do lado de dentro da tela: embaixo se o widget está no alto.
  const pillBelow = anchorOf(place).y === 0;
  const pillAlign = anchorOf(place).x;

  return (
    // Esmaece por `--item-fade` (as folhas aplicam), não por opacity: os tamanhos são vidro.
    <motion.div
      className="group/handle absolute -inset-3"
      initial={{ "--item-fade": 0, scale: 0.98 }}
      animate={{ "--item-fade": 1, scale: 1 }}
      exit={{ "--item-fade": 0, scale: 0.98 }}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: alça arrastável; botão nativo não aceita arrastar com ponteiro capturado */}
      <div
        role="button"
        tabIndex={0}
        aria-roledescription="movable widget"
        aria-label={`${label}. Drag or use the arrow keys to move.`}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
        onKeyDown={onKeyDown}
        className="arrange-handle fade absolute inset-0 cursor-grab touch-none rounded-[1.5rem] data-[dragging=true]:cursor-grabbing"
      />
      <div
        className={cn(
          "absolute flex",
          // Padding, não margem: o vão entre o contorno e os tamanhos faz parte deles, e o
          // hover não se perde no caminho do mouse até lá.
          pillBelow ? "top-full pt-2" : "bottom-full pb-2",
          pillAlign === 0 && "left-0",
          pillAlign === 0.5 && "left-1/2 -translate-x-1/2",
          pillAlign === 1 && "right-0",
          // Invisível não pega clique: antes, os tamanhos de um widget (apagados) ficavam
          // por cima do vizinho e roubavam os cliques dele.
          dragging
            ? "pointer-events-none"
            : "pointer-events-none group-hover/handle:pointer-events-auto group-has-[:focus-visible]/handle:pointer-events-auto",
        )}
      >
        <div
          className={cn(
            "glass fade flex items-center gap-2 rounded-full py-1 pr-1 pl-3 [transition:--self-fade_200ms]",
            dragging
              ? "[--self-fade:0]"
              : // Foco de teclado, não de clique: clicar num tamanho deixava o foco ali e os
                // tamanhos ficavam abertos depois que o mouse saía.
                "[--self-fade:0] group-hover/handle:[--self-fade:1] group-has-[:focus-visible]/handle:[--self-fade:1]",
          )}
        >
          <span className="text-[0.75rem] font-medium text-ink-2">{label}</span>
          <Tabs
            label={`${label} size`}
            size="sm"
            value={size}
            onChange={onSize}
            options={SIZE_OPTIONS}
          />
        </div>
      </div>
    </motion.div>
  );
}
