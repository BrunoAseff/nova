import { useSyncExternalStore } from "react";

/**
 * Como o palco se compõe nesta tela (fundamentos de design, "Composição"):
 * - `grid`: a grade magnética (computador e tablet);
 * - `column`: celular em pé, os widgets numa coluna, o principal no topo;
 * - `row`: celular deitado, pouca altura: o principal e mais um, lado a lado.
 */
export type LayoutMode = "grid" | "column" | "row";

const COLUMN = "(max-width: 639.98px)";
const ROW = "(max-height: 499.98px) and (max-width: 999.98px)";
const TOUCH = "(hover: none)";

function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useLayoutMode(): LayoutMode {
  const column = useMedia(COLUMN);
  const row = useMedia(ROW);
  if (column) return "column";
  if (row) return "row";
  return "grid";
}

/** Celular e tablet: nada de hover, então o que aparecia no hover aparece com o toque. */
export function useTouch(): boolean {
  return useMedia(TOUCH);
}
