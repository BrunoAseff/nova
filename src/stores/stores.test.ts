import { useAmbientStore } from "./ambient";
import { usePreferencesStore } from "./preferences";
import { MAX_REMINDER_LENGTH, MAX_REMINDERS, useRemindersStore } from "./reminders";

beforeEach(() => {
  localStorage.clear();
  useRemindersStore.setState({ reminders: [] });
});

describe("reminders store", () => {
  const state = () => useRemindersStore.getState();

  it("adiciona, edita, reordena e remove", () => {
    const a = state().addReminder("beber água", "challenge") ?? "";
    const b = state().addReminder("respirar", "mindset") ?? "";
    state().updateReminder(a, { text: "beber mais água" });
    state().moveReminder(b, 0);
    expect(state().reminders.map((r) => r.text)).toEqual(["respirar", "beber mais água"]);

    state().removeReminder(b);
    expect(state().reminders).toHaveLength(1);
  });

  it("limita a quantidade e o tamanho do texto", () => {
    for (let i = 0; i < MAX_REMINDERS; i++) state().addReminder(`${i}`, "dream");
    expect(state().addReminder("demais", "dream")).toBeNull();

    useRemindersStore.setState({ reminders: [] });
    state().addReminder("x".repeat(MAX_REMINDER_LENGTH + 10), "dream");
    expect(state().reminders[0]?.text).toHaveLength(MAX_REMINDER_LENGTH);
  });
});

describe("ambient store", () => {
  it("não salva se está tocando (o navegador bloqueia autoplay)", () => {
    useAmbientStore.getState().setVolume(130);
    useAmbientStore.getState().play();
    const saved = JSON.parse(localStorage.getItem("nova:ambient") ?? "{}");
    expect(saved.state).toEqual({ soundId: "ocean-waves", volume: 100 });
  });

  it("som salvo que não existe mais volta para o padrão", async () => {
    localStorage.setItem(
      "nova:ambient",
      JSON.stringify({ state: { soundId: "foi-removido", volume: 20 }, version: 1 }),
    );
    await useAmbientStore.persist.rehydrate();
    expect(useAmbientStore.getState()).toMatchObject({ soundId: "ocean-waves", volume: 20 });
  });
});

describe("preferences store", () => {
  it("persiste tema e widget fixado na chave que o index.html lê", () => {
    usePreferencesStore.getState().setTheme("dark");
    const saved = JSON.parse(localStorage.getItem("nova:preferences") ?? "{}");
    expect(saved.state.theme).toBe("dark");
    expect(saved.state.pinnedWidget).toBe("ambient-sound");
  });
});
