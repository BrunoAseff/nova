import { useEffect } from "react";
import { useAttentionStore } from "@/stores/attention";

/** Tempo parado até os controles sumirem (P1: periferia primeiro). */
export const REST_AFTER_MS = 3500;

/**
 * Liga o estado de atenção aos sinais reais de uso. Fica "active" com mouse, teclado,
 * roda ou toque, e volta a "rest" depois de REST_AFTER_MS parado, a não ser que o
 * ponteiro esteja sobre um controle ou o foco do teclado esteja dentro de um
 * (`[data-keep-awake]`), para nada sumir debaixo da mão.
 */
export function useAttention() {
  const setAttention = useAttentionStore((s) => s.setAttention);

  useEffect(() => {
    let timer: number | undefined;

    const keepAwake = () =>
      document.querySelector("[data-keep-awake]:hover") !== null ||
      document.activeElement?.closest("[data-keep-awake]") != null;

    const scheduleRest = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(function rest() {
        if (keepAwake()) {
          timer = window.setTimeout(rest, REST_AFTER_MS);
          return;
        }
        setAttention("rest");
      }, REST_AFTER_MS);
    };

    const wake = () => {
      setAttention("active");
      scheduleRest();
    };

    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    for (const event of events) window.addEventListener(event, wake, { passive: true });
    scheduleRest();

    return () => {
      window.clearTimeout(timer);
      for (const event of events) window.removeEventListener(event, wake);
    };
  }, [setAttention]);
}
