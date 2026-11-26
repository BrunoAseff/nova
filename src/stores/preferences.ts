import { z } from "zod/mini";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AtmosphereId, atmosphereIds, DEFAULT_ATMOSPHERE } from "@/content/atmospheres";
import { type WidgetId, widgetIds } from "@/content/widgets";
import { systemTheme, type Theme } from "@/lib/theme";
import { persistOptions, syncAcrossTabs } from "./lib/persisted";

const DEFAULT_PINNED: WidgetId = "ambient-sound";

const schema = z.object({
  theme: z.catch(z.enum(["light", "dark"]), () => systemTheme()),
  atmosphere: z.catch(z.enum(atmosphereIds), DEFAULT_ATMOSPHERE),
  reduceTransparency: z.catch(z.boolean(), false),
  pinnedWidget: z.catch(z.enum(widgetIds), DEFAULT_PINNED),
});

type Persisted = z.infer<typeof schema>;

interface PreferencesState extends Persisted {
  setTheme: (theme: Theme) => void;
  setAtmosphere: (atmosphere: AtmosphereId) => void;
  setReduceTransparency: (value: boolean) => void;
  setPinnedWidget: (widget: WidgetId) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      pinnedWidget: DEFAULT_PINNED,
      atmosphere: DEFAULT_ATMOSPHERE,
      reduceTransparency: false,
      setTheme: (theme) => set({ theme }),
      setAtmosphere: (atmosphere) => set({ atmosphere }),
      setReduceTransparency: (reduceTransparency) => set({ reduceTransparency }),
      setPinnedWidget: (pinnedWidget) => set({ pinnedWidget }),
    }),
    persistOptions({
      name: "preferences",
      version: 1,
      schema,
      partialize: ({ theme, pinnedWidget, atmosphere, reduceTransparency }) => ({
        theme,
        pinnedWidget,
        atmosphere,
        reduceTransparency,
      }),
    }),
  ),
);

syncAcrossTabs(usePreferencesStore);

// Em dev, editar um store recarrega a página: o HMR criaria uma segunda cópia do store
// e partes do app continuariam ligadas à antiga.
import.meta.hot?.accept(() => window.location.reload());
