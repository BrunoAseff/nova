import { type KeyboardEvent, useRef } from "react";

/**
 * Navegação por setas num grupo de opções (padrão ARIA de radiogroup): o grupo é uma
 * parada só no Tab, e as setas mudam a opção. Em grade, ↑ e ↓ andam uma linha.
 * `onMove` recebe a opção nova; quem usa decide se mover já seleciona.
 */
export function useRovingGroup<T extends string>(
  values: readonly T[],
  value: T,
  onMove: (value: T) => void,
  { columns = 1 }: { columns?: number } = {},
) {
  const refs = useRef(new Map<T, HTMLElement>());
  const current = values.includes(value) ? value : values[0];

  return (item: T) => ({
    ref: (element: HTMLElement | null) => {
      if (element) refs.current.set(item, element);
      else refs.current.delete(item);
    },
    tabIndex: item === current ? 0 : -1,
    onKeyDown: (event: KeyboardEvent) => {
      const index = values.indexOf(item);
      const last = values.length - 1;
      const vertical = columns > 1 ? columns : 1;
      const next: Record<string, number> = {
        ArrowRight: index + 1,
        ArrowLeft: index - 1,
        ArrowDown: index + vertical,
        ArrowUp: index - vertical,
        Home: 0,
        End: last,
      };
      const target = next[event.key];
      if (target === undefined) return;
      event.preventDefault();
      const wrapped =
        target > last
          ? columns > 1
            ? index
            : 0
          : target < 0
            ? columns > 1
              ? index
              : last
            : target;
      const nextValue = values[wrapped];
      if (nextValue === undefined) return;
      onMove(nextValue);
      refs.current.get(nextValue)?.focus();
    },
  });
}
