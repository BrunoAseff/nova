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

export const positions = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
] as const;

export type Position = (typeof positions)[number];
