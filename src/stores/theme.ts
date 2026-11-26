import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "nova-theme";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      setTheme: (theme) => set({ theme }),
    }),
    { name: THEME_STORAGE_KEY, version: 1 },
  ),
);

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
