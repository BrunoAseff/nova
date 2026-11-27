/** Move o item com `id` para `toIndex`, mantendo a ordem dos outros. */
export function moveItem<T extends { id: string }>(items: T[], id: string, toIndex: number): T[] {
  const from = items.findIndex((item) => item.id === id);
  if (from === -1) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (!item) return items;
  next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, item);
  return next;
}

/** Remove itens com `id` repetido, mantendo o primeiro. */
export function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => !seen.has(item.id) && seen.add(item.id));
}
