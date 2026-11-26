import type { Position } from "@/content/widgets";
import type { Widgets } from "@/stores/spaces";

export type Placed = "clock" | "pomodoro" | "breathing" | "quote";
export type Composition = Partial<Record<Position, Placed[]>>;

const FALLBACK_ORDER: Position[] = ["top-right", "top-left", "bottom-right", "bottom-left"];

/**
 * Decide onde cada widget visível aparece (fundamentos de design, seção 5, "Composição").
 *
 * 1. Instrumentos (L2) disputam o centro: o pomodoro tem prioridade, depois a respiração.
 *    O segundo instrumento, se houver, vai para o primeiro canto livre.
 * 2. Elementos de ambiente (L1) ficam na posição escolhida. Se ela estiver ocupada,
 *    vão para o primeiro canto livre; se não houver, empilham na posição escolhida.
 * Nunca dois elementos se sobrepõem: na mesma zona, eles empilham em ordem.
 */
export function compose(widgets: Widgets): Composition {
  const zones: Composition = {};
  const taken = (zone: Position) => (zones[zone]?.length ?? 0) > 0;
  const put = (zone: Position, item: Placed) => {
    zones[zone] = [...(zones[zone] ?? []), item];
  };
  const firstFree = () => FALLBACK_ORDER.find((zone) => !taken(zone));

  const instruments: Placed[] = [];
  if (widgets.pomodoro.visible) instruments.push("pomodoro");
  if (widgets.breathing.visible) instruments.push("breathing");

  for (const instrument of instruments) {
    put(taken("center") ? (firstFree() ?? "center") : "center", instrument);
  }

  const ambient: [Placed, Position][] = [];
  if (widgets.clock.visible) ambient.push(["clock", widgets.clock.position]);
  if (widgets.quote.visible) ambient.push(["quote", widgets.quote.position]);

  for (const [item, wanted] of ambient) {
    put(taken(wanted) ? (firstFree() ?? wanted) : wanted, item);
  }

  return zones;
}

/** O elemento principal é o do centro: ganha a escala de leitura de longe. */
export function isHero(composition: Composition, item: Placed) {
  return composition.center?.[0] === item;
}
