import { applyTheme, useThemeStore } from "./theme";

describe("theme store", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("persiste o tema escolhido no localStorage", () => {
    useThemeStore.getState().setTheme("dark");

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(JSON.parse(localStorage.getItem("nova-theme") ?? "{}").state.theme).toBe("dark");
  });

  it("aplica o tema no <html>", () => {
    applyTheme("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    applyTheme("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});
