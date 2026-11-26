import { z } from "zod/mini";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type WidgetId, widgetIds } from "@/content/widgets";
import { systemTheme, type Theme } from "@/lib/theme";
import { persistOptions, syncAcrossTabs } from "./lib/persisted";

const DEFAULT_PINNED: WidgetId = "ambient-sound";

const schema = z.object({
  theme: z.catch(z.enum(["light", "dark"]), () => systemTheme()),
  pinnedWidget: z.catch(z.enum(widgetIds), DEFAULT_PINNED),
});

type Persisted = z.infer<typeof schema>;

interface PreferencesState extends Persisted {
  setTheme: (theme: Theme) => void;
  setPinnedWidget: (widget: WidgetId) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      pinnedWidget: DEFAULT_PINNED,
      setTheme: (theme) => set({ theme }),
      setPinnedWidget: (pinnedWidget) => set({ pinnedWidget }),
    }),
    persistOptions({
      name: "preferences",
      version: 1,
      schema,
      partialize: ({ theme, pinnedWidget }) => ({ theme, pinnedWidget }),
    }),
  ),
);

syncAcrossTabs(usePreferencesStore);
