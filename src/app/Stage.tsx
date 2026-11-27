import {
  AnimatePresence,
  type AnimationPlaybackControls,
  animate,
  type MotionValue,
  motion,
  motionValue,
} from "motion/react";
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { type Place, type PlacedWidget, placedWidgets, type WidgetSize } from "@/content/widgets";
import { Breathing } from "@/features/breathing/Breathing";
import { Clock } from "@/features/clock/Clock";
import { Pomodoro } from "@/features/pomodoro/Pomodoro";
import { Quote } from "@/features/quote/Quote";
import { Reminders } from "@/features/reminders/Reminders";
import { calm, duration, ease, glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SIZE_STEP } from "@/lib/widgetSize";
import { useAttentionStore } from "@/stores/attention";
import { type Space, useActiveSpace, useSpacesStore } from "@/stores/spaces";
import { ArrangeHandle, type Ghost } from "./layout/ArrangeHandle";
import { alignOf, anchorOf, findSpot, overlaps, type Rect, rectFor } from "./layout/grid";

/**
 * Palco: cada widget fica num ponto da grade (ver `layout/grid.ts`), posicionado de
 * forma absoluta. Nenhum depende do outro: pôr, tirar ou mover um widget nunca mexe nos
 * demais.
 *
 * Movimento: toda mudança de lugar (arrastar, setas, restaurar, achar lugar livre) passa
 * pelo mesmo FLIP. Depois que o React aplica a posição nova, o palco mede onde o widget
 * estava e onde ficou, desloca-o de volta com um transform e deixa a mola levar até
 * zero. Entrada e saída só esmaecem e escalam no lugar.
 *
 * Nem `filter` nem `opacity` nos contêineres: os dois quebram o backdrop-filter do vidro
 * dentro. Eles animam `--space-fade` e `--item-fade`, e as folhas (`.fade`) aplicam.
 */
export function Stage() {
  const space = useActiveSpace();
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={space.id}
        className="absolute inset-0 px-[clamp(1.5rem,4vw,4rem)] pt-[clamp(1.5rem,5vh,4rem)] pb-[calc(clamp(1rem,3vh,2rem)+5.5rem)]"
        initial={{ "--space-fade": 0 }}
        animate={{ "--space-fade": 1 }}
        exit={{ "--space-fade": 0, pointerEvents: "none" }}
        transition={{ duration: duration.calm, ease: ease.out }}
      >
        <Area space={space} />
      </motion.div>
    </AnimatePresence>
  );
}

const SMALLER: Record<WidgetSize, WidgetSize | null> = { l: "m", m: "s", s: null };

interface Offset {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

function Area({ space }: { space: Space }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const arranging = useAttentionStore((s) => s.arranging);
  const updateWidget = useSpacesStore((s) => s.updateWidget);
  const [ghost, setGhost] = useState<Ghost | null>(null);

  const visible = placedWidgets.filter((id) => space.widgets[id].visible);
  const nodes = useRef(new Map<PlacedWidget, HTMLElement>());
  const offsets = useRef(new Map<PlacedWidget, Offset>());
  /** Último ponto da grade e último tamanho de cada widget, para o FLIP. */
  const lastPlaces = useRef(new Map<PlacedWidget, Place>());
  const lastSizes = useRef(new Map<PlacedWidget, WidgetSize>());
  /** O `--k` de cada widget agora (no meio de uma troca de tamanho, o valor animado). */
  const currentK = useRef(new Map<PlacedWidget, number>());
  const kAnimations = useRef(new Map<PlacedWidget, AnimationPlaybackControls>());
  const firstRender = useRef(true);

  const offsetOf = (id: PlacedWidget): Offset => {
    let offset = offsets.current.get(id);
    if (!offset) {
      offset = { x: motionValue(0), y: motionValue(0) };
      offsets.current.set(id, offset);
    }
    return offset;
  };

  const areaSize = () => ({
    width: areaRef.current?.clientWidth ?? 0,
    height: areaRef.current?.clientHeight ?? 0,
  });

  const sizeOf = (id: PlacedWidget) => {
    const node = nodes.current.get(id);
    return { width: node?.offsetWidth ?? 0, height: node?.offsetHeight ?? 0 };
  };

  /** Retângulos (de layout, sem transforms) dos outros widgets visíveis. */
  const othersOf = (id: PlacedWidget): Rect[] =>
    visible
      .filter((other) => other !== id)
      .map((other) => rectFor(space.widgets[other].place, sizeOf(other), areaSize()));

  useLayoutEffect(() => {
    const area = areaSize();
    if (area.width === 0) return;
    const wasFirst = firstRender.current;
    firstRender.current = false;

    for (const id of visible) {
      const { place, size } = space.widgets[id];
      const pixels = sizeOf(id);
      const rect = rectFor(place, pixels, area);
      const previousPlace = lastPlaces.current.get(id);
      const sizeChanged = lastSizes.current.get(id) !== size;
      lastSizes.current.set(id, size);

      // Ninguém fica em cima de ninguém, nunca (nem depois de um reset ou numa janela
      // menor). Quem acabou de aparecer ou de mudar de tamanho é quem sai do caminho, para
      // o lugar livre mais próximo, e se não couber diminui um tamanho. Fora isso, o que
      // vem depois na ordem cede para o que vem antes.
      const isNew = previousPlace === undefined && !wasFirst;
      const grew = sizeChanged && previousPlace !== undefined;
      const blockers =
        isNew || grew
          ? othersOf(id)
          : visible
              .slice(0, visible.indexOf(id))
              .map((other) => rectFor(space.widgets[other].place, sizeOf(other), area));
      if (blockers.some((o) => overlaps(rect, o))) {
        const { place: spot, free } = findSpot(place, pixels, othersOf(id), area);
        const smaller = SMALLER[size];
        if (!free && (isNew || grew) && smaller) {
          updateWidget(space.id, id, { size: smaller });
          return;
        }
        if (spot.x !== place.x || spot.y !== place.y) {
          updateWidget(space.id, id, { place: spot });
          // Um ajuste por vez: o próximo render recalcula o resto com o lugar novo.
          return;
        }
      }

      const offset = offsetOf(id);

      // Mudou de tamanho: o React já pôs o `--k` novo (e foi com ele que medimos acima,
      // para a regra de sobreposição usar o tamanho final). Agora volta ao valor de antes
      // e anima até o novo: fonte, largura, espaçamento e orbe vão juntos, a partir da
      // âncora, sem sair do lugar.
      const node = nodes.current.get(id);
      const target = SIZE_STEP[size];
      const from = currentK.current.get(id) ?? target;
      if (grew && node && from !== target) {
        kAnimations.current.get(id)?.stop();
        node.style.setProperty("--k", String(from));
        const animation = animate(from, target, {
          duration: 0.45,
          ease: ease.out,
          onUpdate: (k) => {
            currentK.current.set(id, k);
            node.style.setProperty("--k", String(k));
          },
        });
        kAnimations.current.set(id, animation);
        animation.then(() => kAnimations.current.delete(id));
      } else if (!kAnimations.current.has(id)) {
        currentK.current.set(id, target);
      }

      // FLIP só quando o ponto da grade mudou. O "antes" é calculado com o tamanho de
      // agora: assim mudar de tamanho ou de janela nunca vira um deslize.
      if (previousPlace && (previousPlace.x !== place.x || previousPlace.y !== place.y)) {
        const before = rectFor(previousPlace, pixels, area);
        // `jump`, não `set`: `set` registra velocidade, e um salto de centenas de px em
        // zero segundos virava uma velocidade enorme que a mola herdava (o widget
        // balançava loucamente até assentar).
        offset.x.jump(before.left + offset.x.get() - rect.left);
        offset.y.jump(before.top + offset.y.get() - rect.top);
        animate(offset.x, 0, glide);
        animate(offset.y, 0, glide);
      }
      lastPlaces.current.set(id, place);
    }
    for (const id of lastPlaces.current.keys()) {
      if (!visible.includes(id)) {
        lastPlaces.current.delete(id);
        currentK.current.delete(id);
        kAnimations.current.get(id)?.stop();
        kAnimations.current.delete(id);
      }
    }
  });

  // A janela mudou de tamanho: os pontos são frações, então os widgets já acompanham.
  // Só renderiza de novo, para a regra de "ninguém em cima de ninguém" valer no tamanho
  // novo.
  const [, setAreaVersion] = useState(0);
  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    let lastWidth = area.clientWidth;
    let lastHeight = area.clientHeight;
    const observer = new ResizeObserver(() => {
      if (area.clientWidth === lastWidth && area.clientHeight === lastHeight) return;
      lastWidth = area.clientWidth;
      lastHeight = area.clientHeight;
      setAreaVersion((v) => v + 1);
    });
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  const render = (id: PlacedWidget): ReactNode => {
    const widgets = space.widgets;
    const align = alignOf(widgets[id].place);
    switch (id) {
      case "clock":
        return <Clock format={widgets.clock.format} align={align} />;
      case "pomodoro":
        return <Pomodoro />;
      case "breathing":
        return <Breathing technique={widgets.breathing.technique} />;
      case "quote":
        return <Quote align={align} />;
      case "reminders":
        return <Reminders align={align} />;
    }
  };

  return (
    <div ref={areaRef} data-arranging={arranging} className="stage-area relative size-full">
      <AnimatePresence>
        {arranging && (
          <motion.div
            key="grid"
            aria-hidden="true"
            className="stage-grid pointer-events-none absolute -inset-px"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={calm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ghost && (
          <motion.div
            key="ghost"
            aria-hidden="true"
            className="stage-ghost pointer-events-none absolute rounded-[1.5rem]"
            initial={{ opacity: 0, ...ghost.rect }}
            animate={{ opacity: 1, ...ghost.rect }}
            exit={{ opacity: 0 }}
            transition={glide}
          />
        )}
      </AnimatePresence>
      {ghost?.guides.x.map((x) => (
        <div
          key={`gx-${x}`}
          aria-hidden="true"
          className="stage-guide pointer-events-none absolute inset-y-0 w-px"
          style={{ left: x }}
        />
      ))}
      {ghost?.guides.y.map((y) => (
        <div
          key={`gy-${y}`}
          aria-hidden="true"
          className="stage-guide pointer-events-none absolute inset-x-0 h-px"
          style={{ top: y }}
        />
      ))}

      <AnimatePresence>
        {visible.map((id) => {
          const { place, size } = space.widgets[id];
          const anchor = anchorOf(place);
          const offset = offsetOf(id);
          return (
            <motion.div
              key={id}
              // Nada dentro de um widget usa a animação de `layout` do Motion: ela mede a
              // página, e mover o widget fazia os botões de dentro voarem (ver Tabs e
              // ConfirmButton, que animam o que precisam de forma explícita).
              // O widget sob o mouse (ou o arrastado) fica por cima, com os tamanhos dele.
              className="absolute w-max has-[:focus-visible]:z-10 has-[:hover]:z-10 has-[[data-dragging=true]]:z-20"
              style={{
                left: `${place.x * 100}%`,
                top: `${place.y * 100}%`,
                x: offset.x,
                y: offset.y,
                transformOrigin: "0 0",
              }}
              initial={{ "--item-fade": 0, scale: 0.96 }}
              animate={{ "--item-fade": 1, scale: 1 }}
              exit={{ "--item-fade": 0, scale: 0.96 }}
              transition={{ duration: duration.calm, ease: ease.out }}
            >
              {/* A âncora: o ponto da grade fica na borda (ou no centro) certa do widget. */}
              <motion.div
                ref={(node) => {
                  if (node) nodes.current.set(id, node);
                  else nodes.current.delete(id);
                }}
                className={cn("relative", arranging && "select-none")}
                style={{
                  x: `${-anchor.x * 100}%`,
                  y: `${-anchor.y * 100}%`,
                  // O tamanho, contínuo (ver `lib/widgetSize.ts`); a troca anima no efeito.
                  ...({ "--k": SIZE_STEP[size] } as CSSProperties),
                }}
              >
                <div inert={arranging} className="transition-opacity duration-300">
                  {render(id)}
                </div>
                <AnimatePresence>
                  {arranging && (
                    <ArrangeHandle
                      key="handle"
                      id={id}
                      place={place}
                      size={size}
                      offset={offset}
                      area={areaRef}
                      sizeOf={() => sizeOf(id)}
                      othersOf={() => othersOf(id)}
                      othersPlaces={() =>
                        visible.filter((o) => o !== id).map((o) => space.widgets[o].place)
                      }
                      onGhost={setGhost}
                      onPlace={(next) => updateWidget(space.id, id, { place: next })}
                      onSize={(next) => updateWidget(space.id, id, { size: next })}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
