import { useEffect } from "react";
import { ThemeSwitch } from "@/components/arc/theme-switch/theme-switch";
import { getBackground } from "@/content/backgrounds";
import { usePomodoroScheduler } from "@/features/pomodoro/hooks";
import { applyTheme } from "@/lib/theme";
import { usePreferencesStore } from "@/stores/preferences";
import { useActiveSpace } from "@/stores/spaces";

export function App() {
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const space = useActiveSpace();
  const background = getBackground(space.backgroundId);

  usePomodoroScheduler();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <img
        src={background.url}
        alt=""
        className="absolute inset-0 size-full object-cover"
        fetchPriority="high"
        decoding="async"
      />

      <div className="absolute right-6 bottom-6 md:right-10 md:bottom-10">
        <ThemeSwitch theme={theme} onThemeChange={setTheme} iconOnly />
      </div>
    </main>
  );
}
