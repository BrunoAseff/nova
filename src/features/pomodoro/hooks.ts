import { useEffect, useState } from "react";
import { playAlarm } from "@/lib/audio/alarm";
import { usePomodoroStore } from "@/stores/pomodoro";
import { selectActiveSpace, useSpacesStore } from "@/stores/spaces";
import { remainingMs } from "./machine";

function onFinished() {
  const { alarm } = selectActiveSpace(useSpacesStore.getState()).widgets.pomodoro;
  if (alarm.enabled) void playAlarm(alarm.soundId, alarm.repeat);
}

/**
 * Monta uma vez, no App. Agenda um único timeout até o fim da fase atual e,
 * quando a aba volta a ficar visível, recalcula pelo horário (o navegador pode
 * ter atrasado o timeout em segundo plano).
 */
export function usePomodoroScheduler() {
  const session = usePomodoroStore((s) => s.session);
  const sync = usePomodoroStore((s) => s.sync);

  useEffect(() => {
    const check = () => {
      if (sync().length > 0) onFinished();
    };

    check();
    document.addEventListener("visibilitychange", check);

    const timeout =
      session.status === "running"
        ? window.setTimeout(check, Math.max(0, session.endsAt - Date.now()))
        : undefined;

    return () => {
      document.removeEventListener("visibilitychange", check);
      window.clearTimeout(timeout);
    };
  }, [session, sync]);
}

/** Tempo restante em ms, re-renderizando uma vez por segundo enquanto o timer corre. */
export function useRemainingMs() {
  const session = usePomodoroStore((s) => s.session);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setNow(Date.now());
    if (session.status !== "running") return;

    let timeout: number;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      // Alinha o próximo tick à virada do segundo do timer, para o display não "pular".
      const left = session.endsAt - current;
      timeout = window.setTimeout(tick, left % 1000 || 1000);
    };
    tick();
    return () => window.clearTimeout(timeout);
  }, [session]);

  return remainingMs(session, now);
}
