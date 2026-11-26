import { createDefaultSpaces, MAX_SPACES, selectActiveSpace, useSpacesStore } from "./spaces";

const initial = useSpacesStore.getState();

beforeEach(() => {
  localStorage.clear();
  useSpacesStore.setState(initial, true);
  useSpacesStore.getState().resetSpaces();
});

const state = () => useSpacesStore.getState();

describe("spaces store", () => {
  it("começa com Home, Focus e Relax, e Focus ativo", () => {
    expect(state().spaces.map((s) => s.id)).toEqual(["home", "focus", "relax"]);
    expect(selectActiveSpace(state()).name).toBe("Focus");
  });

  it("cria, renomeia e apaga espaços", () => {
    const id = state().createSpace("  Leitura  ", "book");
    expect(id).not.toBeNull();
    const created = state().spaces.find((s) => s.id === id);
    expect(created).toMatchObject({ name: "Leitura", icon: "book" });

    state().renameSpace(id ?? "", "");
    expect(state().spaces.find((s) => s.id === id)?.name).toBe("Space");

    state().deleteSpace(id ?? "");
    expect(state().spaces).toHaveLength(3);
  });

  it(`não passa de ${MAX_SPACES} espaços`, () => {
    for (let i = 0; i < MAX_SPACES; i++) state().createSpace(`s${i}`);
    expect(state().spaces).toHaveLength(MAX_SPACES);
    expect(state().createSpace("demais")).toBeNull();
  });

  it("nunca apaga o último espaço", () => {
    state().deleteSpace("home");
    state().deleteSpace("relax");
    state().deleteSpace("focus");
    expect(state().spaces.map((s) => s.id)).toEqual(["focus"]);
  });

  it("apagar o espaço ativo ativa o vizinho", () => {
    state().deleteSpace("focus");
    expect(state().activeSpaceId).toBe("relax");
    state().deleteSpace("relax");
    expect(state().activeSpaceId).toBe("home");
  });

  it("reordena espaços", () => {
    state().moveSpace("relax", 0);
    expect(state().spaces.map((s) => s.id)).toEqual(["relax", "home", "focus"]);
  });

  it("atualiza só o widget pedido", () => {
    state().updateWidget("home", "clock", { format: "12h" });
    const home = state().spaces.find((s) => s.id === "home");
    expect(home?.widgets.clock).toEqual({ visible: true, position: "center", format: "12h" });
    expect(home?.widgets.pomodoro).toEqual(createDefaultSpaces()[0]?.widgets.pomodoro);
  });

  it("cada uso dos padrões é uma cópia independente", () => {
    const a = createDefaultSpaces();
    const b = createDefaultSpaces();
    expect(a).toEqual(b);
    expect(a[0]?.widgets).not.toBe(b[0]?.widgets);
  });

  it("salva no localStorage com prefixo e versão", () => {
    state().renameSpace("home", "Casa");
    const saved = JSON.parse(localStorage.getItem("nova:spaces") ?? "{}");
    expect(saved.version).toBe(1);
    expect(saved.state.spaces[0].name).toBe("Casa");
    expect(saved.state.activeSpaceId).toBe("focus");
  });
});

describe("spaces store: reidratação", () => {
  async function hydrate(data: unknown) {
    localStorage.setItem("nova:spaces", JSON.stringify({ state: data, version: 1 }));
    await useSpacesStore.persist.rehydrate();
    return state();
  }

  it("campo inválido cai no padrão só daquele campo", async () => {
    const spaces = createDefaultSpaces();
    const broken = structuredClone(spaces) as unknown as Record<string, unknown>[];
    Object.assign(broken[0] as object, { backgroundId: "nao-existe", name: 42 });
    Object.assign((broken[1] as { widgets: { clock: object } }).widgets.clock, { format: "13h" });

    const s = await hydrate({ spaces: broken, activeSpaceId: "home" });

    expect(s.spaces[0]).toMatchObject({ id: "home", backgroundId: "river-path", name: "Space" });
    expect(s.spaces[1]?.widgets.clock.format).toBe("24h");
    // O resto continua igual ao salvo.
    expect(s.spaces[2]).toEqual(spaces[2]);
    expect(s.activeSpaceId).toBe("home");
  });

  it("dado lixo volta para os padrões", async () => {
    const s = await hydrate("lixo");
    expect(s.spaces.map((sp) => sp.id)).toEqual(["home", "focus", "relax"]);
  });

  it("lista vazia volta para os padrões e espaço ativo inexistente vira o primeiro", async () => {
    expect((await hydrate({ spaces: [], activeSpaceId: "x" })).spaces).toHaveLength(3);

    const [first] = createDefaultSpaces();
    const s = await hydrate({ spaces: [first], activeSpaceId: "sumiu" });
    expect(s.activeSpaceId).toBe("home");
  });

  it("remove espaços com id repetido", async () => {
    const [home] = createDefaultSpaces();
    const s = await hydrate({ spaces: [home, home], activeSpaceId: "home" });
    expect(s.spaces).toHaveLength(1);
  });
});
