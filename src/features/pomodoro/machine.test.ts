import {
  advance,
  IDLE,
  LONG_BREAK_EVERY,
  type PomodoroConfig,
  pause,
  remainingMs,
  reset,
  resume,
  skip,
  start,
} from "./machine";

const MIN = 60_000;
const manual: PomodoroConfig = {
  focusMin: 25,
  shortBreakMin: 5,
  longBreakMin: 15,
  autoStart: false,
};
const auto: PomodoroConfig = { ...manual, autoStart: true };

describe("pomodoro machine", () => {
  it("começa um foco que termina na duração configurada", () => {
    const s = start(0, manual, "ler");
    expect(s).toMatchObject({ status: "running", phase: "focus", task: "ler", endsAt: 25 * MIN });
    expect(remainingMs(s, 10 * MIN)).toBe(15 * MIN);
  });

  it("pausa e retoma sem perder tempo", () => {
    const running = start(0, manual);
    const paused = pause(running, 10 * MIN);
    expect(paused).toMatchObject({ status: "paused", remainingMs: 15 * MIN });

    // O tempo pausado não conta.
    expect(remainingMs(paused, 999 * MIN)).toBe(15 * MIN);

    const resumed = resume(paused, 100 * MIN);
    expect(resumed).toMatchObject({ status: "running", endsAt: 115 * MIN });
  });

  it("ignora ações que não fazem sentido no estado atual", () => {
    expect(pause(IDLE, 0)).toBe(IDLE);
    expect(resume(IDLE, 0)).toBe(IDLE);
    expect(skip(IDLE, 0)).toBe(IDLE);
    const running = start(0, manual);
    expect(resume(running, 0)).toBe(running);
  });

  it("não avança antes do fim da fase", () => {
    const s = start(0, manual);
    expect(advance(s, 25 * MIN - 1)).toEqual({ session: s, finished: [] });
  });

  it("sem autoStart, termina o foco e espera na pausa curta", () => {
    const { session, finished } = advance(start(0, manual), 25 * MIN);
    expect(finished).toEqual(["focus"]);
    expect(session).toMatchObject({
      status: "paused",
      phase: "shortBreak",
      completedFocus: 1,
      remainingMs: 5 * MIN,
    });
  });

  it(`faz uma pausa longa a cada ${LONG_BREAK_EVERY} focos`, () => {
    let s = start(0, manual);
    const phases: string[] = [];
    for (let i = 0; i < LONG_BREAK_EVERY * 2; i++) {
      s = skip(s, 0);
      if (s.status !== "idle") phases.push(s.phase);
    }
    expect(phases).toEqual([
      "shortBreak",
      "focus",
      "shortBreak",
      "focus",
      "shortBreak",
      "focus",
      "longBreak",
      "focus",
    ]);
    expect(s).toMatchObject({ completedFocus: 0 });
  });

  it("com autoStart, a fase nova começa quando a anterior terminou, não quando a aba acordou", () => {
    const { session, finished } = advance(start(0, auto), 27 * MIN);
    expect(finished).toEqual(["focus"]);
    // A pausa curta começou em 25min e termina em 30min.
    expect(session).toMatchObject({ status: "running", phase: "shortBreak", endsAt: 30 * MIN });
  });

  it("com autoStart, avança várias fases de uma vez depois de muito tempo dormindo", () => {
    // 25 foco + 5 pausa + 25 foco = 55min; aos 56min está na segunda pausa curta.
    const { session, finished } = advance(start(0, auto), 56 * MIN);
    expect(finished).toEqual(["focus", "shortBreak", "focus"]);
    expect(session).toMatchObject({ phase: "shortBreak", completedFocus: 2, endsAt: 60 * MIN });
  });

  it("guarda a config no início: mudanças só valem para a próxima sessão", () => {
    const s = start(0, manual);
    const { session } = advance(s, 25 * MIN);
    expect(session).toMatchObject({ config: manual, remainingMs: 5 * MIN });
  });

  it("reset volta para idle", () => {
    expect(reset()).toEqual(IDLE);
  });
});
