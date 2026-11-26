import { useEffect } from "react";
import { useAmbientStore } from "@/stores/ambient";
import { useAttentionStore } from "@/stores/attention";
import { usePomodoroStore } from "@/stores/pomodoro";
import { selectActiveSpace, useSpacesStore } from "@/stores/spaces";

/**
 * Atalhos de teclado. Funcionam mesmo com os controles escondidos (P1: o teclado
 * nunca depende do mouse ter mexido).
 *   Espaço  começar / pausar / retomar o pomodoro
 *   1–8     trocar de espaço
 *   M       tocar / pausar o som ambiente
 *   ,       abrir configurações
 */
export function useShortcuts() {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, [contenteditable='true'], [role='dialog']")) return;
      // Botões e controles focados já usam Espaço/Enter: não roubar.
      if (event.key === " " && target?.closest("button, [role='radio'], [role='tab']")) return;

      const spaces = useSpacesStore.getState();
      if (/^[1-8]$/.test(event.key)) {
        const space = spaces.spaces[Number(event.key) - 1];
        if (space) spaces.setActiveSpace(space.id);
        return;
      }

      if (event.key === " ") {
        if (!selectActiveSpace(spaces).widgets.pomodoro.visible) return;
        event.preventDefault();
        const pomodoro = usePomodoroStore.getState();
        const { status } = pomodoro.session;
        if (status === "idle") pomodoro.start();
        else if (status === "running") pomodoro.pause();
        else pomodoro.resume();
        return;
      }

      if (event.key.toLowerCase() === "m") useAmbientStore.getState().toggle();
      if (event.key === ",") useAttentionStore.getState().setPanelOpen(true);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
