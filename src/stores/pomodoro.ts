import { z } from "zod/mini";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as machine from "@/features/pomodoro/machine";
import { persistOptions, syncAcrossTabs } from "./lib/persisted";
import { selectActiveSpace, useSpacesStore } from "./spaces";

const phase = z.enum(["focus", "shortBreak", "longBreak"]);
const minutes = z.int().check(z.minimum(1), z.maximum(180));

const configSchema = z.object({
  focusMin: minutes,
  shortBreakMin: minutes,
  longBreakMin: minutes,
  autoStart: z.boolean(),
});

const active = {
  phase,
  completedFocus: z.int().check(z.minimum(0), z.maximum(machine.LONG_BREAK_EVERY - 1)),
  task: z.string(),
  config: configSchema,
};

const sessionSchema = z.union([
  z.object({ status: z.literal("idle") }),
  z.object({ status: z.literal("running"), ...active, endsAt: z.number() }),
  z.object({ status: z.literal("paused"), ...active, remainingMs: z.number().check(z.minimum(0)) }),
]);

// Uma sessão inválida não tem conserto campo a campo: volta inteira para "idle".
const schema = z.object({ session: z.catch(sessionSchema, machine.IDLE) });

type Persisted = { session: machine.PomodoroSession };

interface PomodoroState extends Persisted {
  start: (task?: string) => void;
  pause: () => void;
  resume: () => void;
  skip: () => void;
  reset: () => void;
  setTask: (task: string) => void;
  /** Leva a sessão até agora. Devolve as fases que terminaram, para quem chamou tocar o alarme. */
  sync: () => machine.Phase[];
}

function activeConfig(): machine.PomodoroConfig {
  const { focusMin, shortBreakMin, longBreakMin, autoStart } = selectActiveSpace(
    useSpacesStore.getState(),
  ).widgets.pomodoro;
  return { focusMin, shortBreakMin, longBreakMin, autoStart };
}

/** Sessão global: um timer só, visível em qualquer espaço que mostre o pomodoro. */
export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      session: machine.IDLE,

      start: (task) => set({ session: machine.start(Date.now(), activeConfig(), task) }),
      pause: () => set((s) => ({ session: machine.pause(s.session, Date.now()) })),
      resume: () => set((s) => ({ session: machine.resume(s.session, Date.now()) })),
      skip: () => set((s) => ({ session: machine.skip(s.session, Date.now()) })),
      reset: () => set({ session: machine.reset() }),

      setTask: (task) =>
        set((s) => (s.session.status === "idle" ? s : { session: { ...s.session, task } })),

      sync: () => {
        const { session, finished } = machine.advance(get().session, Date.now());
        if (finished.length > 0) set({ session });
        return finished;
      },
    }),
    persistOptions({
      name: "pomodoro",
      version: 1,
      schema,
      partialize: ({ session }) => ({ session }),
    }),
  ),
);

syncAcrossTabs(usePomodoroStore);
