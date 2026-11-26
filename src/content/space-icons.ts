/**
 * Ícones que um espaço pode usar. O estado guarda só a chave; o desenho de cada um
 * vem da biblioteca própria de ícones (item 3).
 */
export const spaceIcons = [
  "home",
  "focus",
  "relax",
  "book",
  "coffee",
  "leaf",
  "moon",
  "sun",
] as const;

export type SpaceIcon = (typeof spaceIcons)[number];
