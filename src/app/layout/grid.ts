import type { Place } from "@/content/widgets";

/**
 * A grade do palco. A área útil (a tela menos as margens e a faixa do dock) tem 12
 * colunas e 8 linhas; um widget sempre se prende a um cruzamento dessas linhas.
 *
 * A âncora vem do terço em que o ponto cai: no terço esquerdo o widget se prende pela
 * borda esquerda, no do meio pelo centro, no direito pela borda direita (e o mesmo na
 * vertical). Assim o texto se alinha ao lado em que está e o widget nunca sai da tela
 * quando a janela muda de tamanho.
 */
export const COLS = 12;
export const ROWS = 8;
/** Espaço mínimo entre dois widgets, em px. */
export const GAP = 16;

export type Anchor = 0 | 0.5 | 1;

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const EPSILON = 1e-6;

/** Terço em que um valor (0–1) cai, medido em casas da grade. */
function anchorFor(value: number, cells: number): Anchor {
  const cell = value * cells;
  if (cell <= cells / 4 + EPSILON) return 0;
  if (cell >= (cells * 3) / 4 - EPSILON) return 1;
  return 0.5;
}

export function anchorOf(place: Place): { x: Anchor; y: Anchor } {
  return { x: anchorFor(place.x, COLS), y: anchorFor(place.y, ROWS) };
}

export function alignOf(place: Place): "start" | "center" | "end" {
  const { x } = anchorOf(place);
  return x === 0 ? "start" : x === 1 ? "end" : "center";
}

export function snap(place: Place): Place {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return {
    x: Math.round(clamp(place.x) * COLS) / COLS,
    y: Math.round(clamp(place.y) * ROWS) / ROWS,
  };
}

/** Retângulo do widget dentro da área (em px), a partir do ponto e da âncora. */
export function rectFor(place: Place, size: Size, area: Size): Rect {
  const anchor = anchorOf(place);
  return {
    left: place.x * area.width - anchor.x * size.width,
    top: place.y * area.height - anchor.y * size.height,
    width: size.width,
    height: size.height,
  };
}

/** Ponto da grade mais próximo para um retângulo solto (enquanto arrasta). */
export function placeFromRect(rect: Rect, area: Size): Place {
  const center = {
    x: (rect.left + rect.width / 2) / area.width,
    y: (rect.top + rect.height / 2) / area.height,
  };
  const anchor = anchorOf(snap(center));
  return snap({
    x: (rect.left + anchor.x * rect.width) / area.width,
    y: (rect.top + anchor.y * rect.height) / area.height,
  });
}

export function fits(rect: Rect, area: Size): boolean {
  const tolerance = 1;
  return (
    rect.left >= -tolerance &&
    rect.top >= -tolerance &&
    rect.left + rect.width <= area.width + tolerance &&
    rect.top + rect.height <= area.height + tolerance
  );
}

export function overlaps(a: Rect, b: Rect, gap = GAP): boolean {
  return !(
    a.left + a.width + gap <= b.left ||
    b.left + b.width + gap <= a.left ||
    a.top + a.height + gap <= b.top ||
    b.top + b.height + gap <= a.top
  );
}

/**
 * O lugar livre mais próximo de `desired`: um cruzamento da grade onde o widget cabe na
 * área e não encosta em nenhum outro (`free: true`). Se nada estiver livre, o mais
 * próximo que pelo menos cabe (`free: false`), para quem chama decidir (ex.: diminuir).
 */
export function findSpot(
  desired: Place,
  size: Size,
  others: Rect[],
  area: Size,
): { place: Place; free: boolean } {
  const target = rectFor(snap(desired), size, area);
  const candidates: { place: Place; distance: number }[] = [];
  for (let col = 0; col <= COLS; col++) {
    for (let row = 0; row <= ROWS; row++) {
      const place = { x: col / COLS, y: row / ROWS };
      const rect = rectFor(place, size, area);
      if (!fits(rect, area)) continue;
      const distance = Math.hypot(rect.left - target.left, rect.top - target.top);
      candidates.push({ place, distance });
    }
  }
  candidates.sort((a, b) => a.distance - b.distance);
  const free = candidates.find(
    ({ place }) => !others.some((other) => overlaps(rectFor(place, size, area), other)),
  );
  if (free) return { place: free.place, free: true };
  return { place: candidates[0]?.place ?? snap(desired), free: false };
}

export function findFreeSpot(desired: Place, size: Size, others: Rect[], area: Size): Place {
  return findSpot(desired, size, others, area).place;
}

/**
 * Um passo do teclado: anda `cells` casas na direção pedida e, se cair em cima de
 * alguém, continua andando até achar lugar (ou parar na borda).
 */
export function step(
  from: Place,
  direction: { x: number; y: number },
  cells: number,
  size: Size,
  others: Rect[],
  area: Size,
): Place {
  let place = snap(from);
  for (let i = 0; i < COLS + ROWS; i++) {
    const next = snap({
      x: place.x + (direction.x * cells) / COLS,
      y: place.y + (direction.y * cells) / ROWS,
    });
    if (next.x === place.x && next.y === place.y) return from;
    const rect = rectFor(next, size, area);
    if (!fits(rect, area)) return from;
    place = next;
    if (!others.some((other) => overlaps(rect, other))) return place;
  }
  return from;
}
