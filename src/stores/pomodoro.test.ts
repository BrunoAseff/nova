import { usePomodoroStore } from "./pomodoro";
import { useSpacesStore } from "./spaces";

const MIN = 60_000;
const state = () => usePomodoroStore.getState();

beforeEach(() => {
  vi.useFakeTimers({ now: 0 });
  localStorage.clear();
  useSpacesStore.getState().resetSpaces();
  state().reset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("pomodoro store", () => {
  it("usa a config do espaço ativo ao começar", () => {
    useSpacesStore.getState().updateWidget("focus", "pomodoro", { focusMin: 50 });
    state().start("escrever");
    expect(state().session).toMatchObject({
      status: "running",
      task: "escrever",
      endsAt: 50 * MIN,
    });
  });

  it("sync avança a fase e informa o que terminou", () => {
    state().start();
    vi.setSystemTime(25 * MIN);
    expect(state().sync()).toEqual(["focus"]);
    expect(state().session).toMatchObject({ status: "paused", phase: "shortBreak" });
    expect(state().sync()).toEqual([]);
  });

  it("persiste a sessão para sobreviver a um reload", () => {
    state().start();
    const saved = JSON.parse(localStorage.getItem("nova:pomodoro") ?? "{}");
    expect(saved.state.session).toMatchObject({ status: "running", endsAt: 25 * MIN });
  });

  it("sessão salva inválida volta para idle", async () => {
    localStorage.setItem(
      "nova:pomodoro",
      JSON.stringify({ state: { session: { status: "running", phase: "nap" } }, version: 1 }),
    );
    await usePomodoroStore.persist.rehydrate();
    expect(state().session).toEqual({ status: "idle" });
  });
});
