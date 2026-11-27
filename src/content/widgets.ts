/** Widgets que o atalho fixado na tela pode abrir. */
export const widgetIds = [
  "clock",
  "pomodoro",
  "quote",
  "breathing",
  "reminders",
  "ambient-sound",
  "background",
  "appearance",
] as const;

export type WidgetId = (typeof widgetIds)[number];

/** Widgets que aparecem no palco e podem ser arranjados. */
export const placedWidgets = ["clock", "pomodoro", "breathing", "quote", "reminders"] as const;
export type PlacedWidget = (typeof placedWidgets)[number];

export const PLACED_WIDGET_LABEL: Record<PlacedWidget, string> = {
  clock: "Clock",
  pomodoro: "Pomodoro",
  breathing: "Breathing",
  quote: "Quote",
  reminders: "Reminders",
};

export const widgetSizes = ["s", "m", "l"] as const;
export type WidgetSize = (typeof widgetSizes)[number];

/**
 * Onde um widget fica no palco: um ponto da área útil em frações (0–1), sempre numa
 * linha da grade (ver `app/layout/grid.ts`). O lado do ponto decide a âncora: no terço
 * esquerdo o widget se prende pela borda esquerda, no do meio pelo centro, no direito
 * pela borda direita. Assim ele não sai da tela quando a janela muda de tamanho.
 */
export interface Place {
  x: number;
  y: number;
}

/** Posições do formato antigo (cantos e centro), convertidas na migração para a v2. */
export const LEGACY_POSITION_PLACE: Record<string, Place> = {
  "top-left": { x: 0, y: 0 },
  "top-right": { x: 1, y: 0 },
  "bottom-left": { x: 0, y: 1 },
  "bottom-right": { x: 1, y: 1 },
  center: { x: 0.5, y: 0.5 },
};
