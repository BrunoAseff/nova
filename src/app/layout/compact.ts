import { type PlacedWidget, placedWidgets, type WidgetSize } from "@/content/widgets";
import type { Space } from "@/stores/spaces";

const SIZE_RANK: Record<WidgetSize, number> = { s: 0, m: 1, l: 2 };

/**
 * A ordem da grade, lida para a coluna do celular: o principal primeiro (o maior e, no
 * empate, o mais perto do centro), depois os outros na ordem de leitura (de cima para
 * baixo, da esquerda para a direita).
 */
export function derivedOrder(space: Pick<Space, "widgets">): PlacedWidget[] {
  const visible = placedWidgets.filter((id) => space.widgets[id].visible);
  if (visible.length === 0) return [];
  const fromCenter = (id: PlacedWidget) => {
    const { x, y } = space.widgets[id].place;
    return Math.hypot(x - 0.5, y - 0.5);
  };
  const main = [...visible].sort(
    (a, b) =>
      SIZE_RANK[space.widgets[b].size] - SIZE_RANK[space.widgets[a].size] ||
      fromCenter(a) - fromCenter(b),
  )[0] as PlacedWidget;
  const rest = visible
    .filter((id) => id !== main)
    .sort((a, b) => {
      const pa = space.widgets[a].place;
      const pb = space.widgets[b].place;
      return pa.y - pb.y || pa.x - pb.x;
    });
  return [main, ...rest];
}

/**
 * A ordem da coluna: a que o usuário escolheu no celular, só com os widgets ligados, e os
 * que ele ainda não ordenou (ligados depois) no fim, na ordem derivada da grade.
 */
export function compactOrder(space: Pick<Space, "widgets" | "compact">): PlacedWidget[] {
  const derived = derivedOrder(space);
  const saved = space.compact.order.filter((id) => space.widgets[id].visible);
  return [...saved, ...derived.filter((id) => !saved.includes(id))];
}

/** O tamanho no celular: o escolhido lá, senão o da grade. */
export function compactSize(
  space: Pick<Space, "widgets" | "compact">,
  id: PlacedWidget,
): WidgetSize {
  return space.compact.sizes[id] ?? space.widgets[id].size;
}
