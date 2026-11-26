import { createDefaultSpaces } from "@/stores/spaces";
import { compose, isHero } from "./composition";

const [home, focus, relax] = createDefaultSpaces();

describe("compose", () => {
  it("Home: relógio no centro, citação embaixo à esquerda", () => {
    const c = compose(home?.widgets ?? ({} as never));
    expect(c).toEqual({ center: ["clock"], "bottom-left": ["quote"] });
    expect(isHero(c, "clock")).toBe(true);
  });

  it("Focus: o pomodoro é o herói", () => {
    const c = compose(focus?.widgets ?? ({} as never));
    expect(c.center).toEqual(["pomodoro"]);
  });

  it("Relax: respiração no centro, citação no canto", () => {
    const c = compose(relax?.widgets ?? ({} as never));
    expect(c).toEqual({ center: ["breathing"], "top-right": ["quote"] });
  });

  it("relógio pedindo o centro ocupado vai para o primeiro canto livre", () => {
    const widgets = structuredClone(focus?.widgets ?? ({} as never));
    widgets.clock = { visible: true, position: "center", format: "24h" };
    expect(compose(widgets)).toEqual({ center: ["pomodoro"], "top-right": ["clock"] });
  });

  it("dois instrumentos: pomodoro no centro, respiração no canto", () => {
    const widgets = structuredClone(focus?.widgets ?? ({} as never));
    widgets.breathing.visible = true;
    expect(compose(widgets)).toMatchObject({ center: ["pomodoro"], "top-right": ["breathing"] });
  });
});
