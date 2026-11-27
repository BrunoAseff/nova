/**
 * Regras do pomodoro como funções puras: recebem a sessão e o horário atual e devolvem
 * a próxima sessão. Nada aqui lê relógio, store ou DOM, então tudo é testável.
 *
 * O tempo é guardado como horário de término (`endsAt`), não como ticks: o que aparece
 * na tela é sempre derivado de `endsAt - agora`. Isso evita drift, funciona com a aba em
 * segundo plano e sobrevive a um reload.
 */

export type Phase = "focus" | "shortBreak" | "longBreak";

export interface PomodoroConfig {
  focusMin: number;
  shortBreakMin: number;
  longBreakMin: number;
  autoStart: boolean;
}

/** A cada quantos focos completos vem uma pausa longa. */
export const LONG_BREAK_EVERY = 4;

export type PomodoroSession =
  | { status: "idle" }
  | {
      status: "running";
      phase: Phase;
      /** Focos completos desde a última pausa longa (0 a LONG_BREAK_EVERY - 1). */
      completedFocus: number;
      task: string;
      config: PomodoroConfig;
      endsAt: number;
    }
  | {
      status: "paused";
      phase: Phase;
      completedFocus: number;
      task: string;
      config: PomodoroConfig;
      remainingMs: number;
    };

export type ActiveSession = Exclude<PomodoroSession, { status: "idle" }>;

export const IDLE: PomodoroSession = { status: "idle" };

const MINUTE = 60_000;

export function phaseDurationMs(phase: Phase, config: PomodoroConfig): number {
  const minutes =
    phase === "focus"
      ? config.focusMin
      : phase === "shortBreak"
        ? config.shortBreakMin
        : config.longBreakMin;
  return minutes * MINUTE;
}

/** Começa um foco do zero. A config fica guardada na sessão: mudanças valem para a próxima. */
export function start(now: number, config: PomodoroConfig, task = ""): PomodoroSession {
  return {
    status: "running",
    phase: "focus",
    completedFocus: 0,
    task,
    config,
    endsAt: now + phaseDurationMs("focus", config),
  };
}

export function pause(session: PomodoroSession, now: number): PomodoroSession {
  if (session.status !== "running") return session;
  const { endsAt, ...rest } = session;
  return { ...rest, status: "paused", remainingMs: Math.max(0, endsAt - now) };
}

export function resume(session: PomodoroSession, now: number): PomodoroSession {
  if (session.status !== "paused") return session;
  const { remainingMs, ...rest } = session;
  return { ...rest, status: "running", endsAt: now + remainingMs };
}

export function reset(): PomodoroSession {
  return IDLE;
}

function nextPhase(phase: Phase, completedFocus: number) {
  if (phase !== "focus") return { phase: "focus" as const, completedFocus };
  const done = completedFocus + 1;
  return done >= LONG_BREAK_EVERY
    ? { phase: "longBreak" as const, completedFocus: 0 }
    : { phase: "shortBreak" as const, completedFocus: done };
}

/**
 * Pula para a próxima fase agora. Com `autoStart`, ela já começa a correr;
 * sem, fica pausada com a duração cheia, esperando o usuário.
 */
export function skip(session: PomodoroSession, now: number): PomodoroSession {
  if (session.status === "idle") return session;
  const { phase, completedFocus } = nextPhase(session.phase, session.completedFocus);
  return enterPhase(session, phase, completedFocus, now);
}

function enterPhase(
  session: ActiveSession,
  phase: Phase,
  completedFocus: number,
  startsAt: number,
): PomodoroSession {
  const { task, config } = session;
  const duration = phaseDurationMs(phase, config);
  return config.autoStart
    ? { status: "running", phase, completedFocus, task, config, endsAt: startsAt + duration }
    : { status: "paused", phase, completedFocus, task, config, remainingMs: duration };
}

export interface AdvanceResult {
  session: PomodoroSession;
  /** Fases que terminaram desde a última verificação, em ordem. Vazio se nada terminou. */
  finished: Phase[];
}

/**
 * Leva a sessão até `now`. Se a fase atual já terminou, avança. Com `autoStart`, pode avançar
 * várias fases de uma vez (ex.: a aba ficou dormindo), e cada fase nova começa exatamente
 * quando a anterior terminou, não quando a aba acordou.
 */
export function advance(session: PomodoroSession, now: number): AdvanceResult {
  const finished: Phase[] = [];
  let current = session;

  while (current.status === "running" && now >= current.endsAt) {
    finished.push(current.phase);
    const { phase, completedFocus } = nextPhase(current.phase, current.completedFocus);
    current = enterPhase(current, phase, completedFocus, current.endsAt);
  }

  return { session: current, finished };
}

export function remainingMs(session: PomodoroSession, now: number): number {
  if (session.status === "idle") return 0;
  if (session.status === "paused") return session.remainingMs;
  return Math.max(0, session.endsAt - now);
}
