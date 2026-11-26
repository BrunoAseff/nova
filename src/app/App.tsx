import { useEffect } from "react";
import { usePomodoroScheduler } from "@/features/pomodoro/hooks";
import { applyTheme } from "@/lib/theme";
import { useAttentionStore } from "@/stores/attention";
import { usePreferencesStore } from "@/stores/preferences";
import { Dock } from "./Dock";
import { Scene } from "./Scene";
import { SettingsPanel } from "./SettingsPanel";
import { Stage } from "./Stage";
import { useAttention } from "./useAttention";
import { useShortcuts } from "./useShortcuts";

/**
 * Camadas (fundamentos de design, seção 5):
 * L0 Scene · L1/L2 Stage (ambiente e instrumentos) · L3 Dock · L4 SettingsPanel.
 */
export function App() {
  const theme = usePreferencesStore((s) => s.theme);
  const atmosphere = usePreferencesStore((s) => s.atmosphere);
  const reduceTransparency = usePreferencesStore((s) => s.reduceTransparency);
  const attention = useAttentionStore((s) => s.attention);

  usePomodoroScheduler();
  useAttention();
  useShortcuts();

  useEffect(() => applyTheme(theme), [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.atmosphere = atmosphere;
    root.dataset.attention = attention;
    if (reduceTransparency) root.dataset.transparency = "reduced";
    else delete root.dataset.transparency;
  }, [atmosphere, attention, reduceTransparency]);

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <Scene />
      <Stage />
      <Dock />
      <SettingsPanel />
    </main>
  );
}
