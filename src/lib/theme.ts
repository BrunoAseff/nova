export type Theme = "light" | "dark";

export function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Aplica o tema no <html>. Usa View Transitions quando existe e o usuário não pediu menos movimento. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const update = () => {
    root.dataset.theme = theme;
  };

  if (!reduceMotion && "startViewTransition" in document) {
    document.startViewTransition(update);
  } else {
    update();
  }
}
