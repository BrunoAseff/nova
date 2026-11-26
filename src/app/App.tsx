import { useEffect } from "react";
import { ThemeSwitch } from "@/components/arc/theme-switch/theme-switch";
import { backgrounds } from "@/content/backgrounds";
import { applyTheme, useThemeStore } from "@/stores/theme";

const background = backgrounds[0];

export function App() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

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
