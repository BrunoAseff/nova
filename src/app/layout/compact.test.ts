import { describe, expect, it } from "vitest";
import { createDefaultSpaces, type Space } from "@/stores/spaces";
import { compactOrder, compactSize, derivedOrder } from "./compact";

const space = (id: string): Space => {
  const found = createDefaultSpaces().find((s) => s.id === id);
  if (!found) throw new Error(id);
  return found;
};

describe("coluna do celular", () => {
  it("põe o principal (o maior) primeiro e o resto na ordem de leitura", () => {
    const focus = space("focus");
    // Focus: pomodoro grande no centro, lembretes no canto de cima à esquerda.
    expect(derivedOrder(focus)).toEqual(["pomodoro", "reminders"]);
    const home = space("home");
    home.widgets.reminders.visible = true;
    expect(derivedOrder(home)).toEqual(["clock", "reminders", "quote"]);
  });

  it("no empate de tamanho, o mais perto do centro é o principal", () => {
    const home = space("home");
    home.widgets.clock.size = "m";
    home.widgets.quote.size = "m";
    expect(derivedOrder(home)[0]).toBe("clock");
  });

  it("segue a ordem escolhida e põe no fim quem foi ligado depois", () => {
    const home = space("home");
    home.compact.order = ["quote", "clock"];
    home.widgets.pomodoro.visible = true;
    expect(compactOrder(home)).toEqual(["quote", "clock", "pomodoro"]);
    home.widgets.quote.visible = false;
    expect(compactOrder(home)).toEqual(["clock", "pomodoro"]);
  });

  it("o tamanho do celular é à parte; sem escolha, vale o da grade", () => {
    const home = space("home");
    expect(compactSize(home, "clock")).toBe("l");
    home.compact.sizes.clock = "s";
    expect(compactSize(home, "clock")).toBe("s");
    expect(home.widgets.clock.size).toBe("l");
  });
});
