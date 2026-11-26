import { z } from "zod/mini";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type BackgroundId, backgroundIds, DEFAULT_BACKGROUND_ID } from "@/content/backgrounds";
import { breathingTechniqueIds } from "@/content/breathing";
import { alarmSoundIds, DEFAULT_ALARM_SOUND_ID } from "@/content/sounds";
import { type SpaceIcon, spaceIcons } from "@/content/space-icons";
import { positions } from "@/content/widgets";
import { moveItem, uniqueById } from "@/lib/collections";
import { persistOptions, syncAcrossTabs } from "./lib/persisted";

export const MAX_SPACES = 8;
export const MAX_SPACE_NAME_LENGTH = 24;

/* ------------------------------------------------------------------ schema */

// Como todo campo tem `z.catch`, validar `{}` devolve os padrões. Assim o schema é a única
// fonte dos valores padrão de cada widget.
const defaultsOf =
  <T>(schema: z.ZodMiniType<T>) =>
  () =>
    z.parse(schema, {});

const position = z.enum(positions);
const minutes = z.int().check(z.minimum(1), z.maximum(180));

const clockSchema = z.object({
  visible: z.catch(z.boolean(), true),
  position: z.catch(position, "center"),
  format: z.catch(z.enum(["12h", "24h"]), "24h"),
});

const alarmSchema = z.object({
  enabled: z.catch(z.boolean(), true),
  soundId: z.catch(z.enum(alarmSoundIds), DEFAULT_ALARM_SOUND_ID),
  repeat: z.catch(z.int().check(z.minimum(1), z.maximum(10)), 3),
});

const pomodoroSchema = z.object({
  visible: z.catch(z.boolean(), false),
  focusMin: z.catch(minutes, 25),
  shortBreakMin: z.catch(minutes, 5),
  longBreakMin: z.catch(minutes, 15),
  autoStart: z.catch(z.boolean(), false),
  alarm: z.catch(alarmSchema, defaultsOf(alarmSchema)),
});

const quoteSchema = z.object({
  visible: z.catch(z.boolean(), false),
  position: z.catch(position, "bottom-left"),
});

const breathingSchema = z.object({
  visible: z.catch(z.boolean(), false),
  technique: z.catch(z.enum(breathingTechniqueIds), "box"),
});

const remindersSchema = z.object({
  visible: z.catch(z.boolean(), false),
  position: z.catch(position, "top-right"),
});

const widgetsSchema = z.object({
  clock: z.catch(clockSchema, defaultsOf(clockSchema)),
  pomodoro: z.catch(pomodoroSchema, defaultsOf(pomodoroSchema)),
  quote: z.catch(quoteSchema, defaultsOf(quoteSchema)),
  breathing: z.catch(breathingSchema, defaultsOf(breathingSchema)),
  reminders: z.catch(remindersSchema, defaultsOf(remindersSchema)),
});

const spaceSchema = z.object({
  id: z.catch(z.string().check(z.minLength(1)), () => crypto.randomUUID()),
  name: z.catch(
    z.string().check(z.trim(), z.minLength(1), z.maxLength(MAX_SPACE_NAME_LENGTH)),
    "Space",
  ),
  icon: z.catch(z.enum(spaceIcons), "home"),
  backgroundId: z.catch(z.enum(backgroundIds), DEFAULT_BACKGROUND_ID),
  widgets: z.catch(widgetsSchema, defaultsOf(widgetsSchema)),
});

const schema = z.object({
  spaces: z.catch(z.array(spaceSchema).check(z.minLength(1), z.maxLength(MAX_SPACES)), () =>
    createDefaultSpaces(),
  ),
  activeSpaceId: z.catch(z.string(), "focus"),
});

export type Space = z.infer<typeof spaceSchema>;
export type Widgets = Space["widgets"];
export type WidgetKey = keyof Widgets;
type Persisted = z.infer<typeof schema>;

/* ---------------------------------------------------------------- defaults */

function defaultWidgets(): Widgets {
  return z.parse(widgetsSchema, {});
}

function createSpace(fields: Pick<Space, "name" | "icon"> & Partial<Space>): Space {
  return {
    id: crypto.randomUUID(),
    backgroundId: DEFAULT_BACKGROUND_ID,
    widgets: defaultWidgets(),
    ...fields,
  };
}

/** Os três espaços iniciais. Uma função (e não uma constante) para cada uso ter a sua cópia. */
export function createDefaultSpaces(): Space[] {
  const home = defaultWidgets();
  home.quote.visible = true;

  const focus = defaultWidgets();
  focus.clock = { visible: false, position: "top-right", format: "24h" };
  focus.pomodoro.visible = true;

  const relax = defaultWidgets();
  relax.clock.visible = false;
  relax.breathing.visible = true;
  relax.quote = { visible: true, position: "top-right" };

  return [
    createSpace({ id: "home", name: "Home", icon: "home", widgets: home }),
    createSpace({ id: "focus", name: "Focus", icon: "focus", widgets: focus }),
    createSpace({ id: "relax", name: "Relax", icon: "relax", widgets: relax }),
  ];
}

/* ------------------------------------------------------------------- store */

interface SpacesState extends Persisted {
  setActiveSpace: (id: string) => void;
  /** Devolve o id do espaço criado, ou `null` se já estiver no limite. */
  createSpace: (name: string, icon?: SpaceIcon) => string | null;
  renameSpace: (id: string, name: string) => void;
  setSpaceIcon: (id: string, icon: SpaceIcon) => void;
  setBackground: (id: string, backgroundId: BackgroundId) => void;
  /** Não apaga o último espaço. Se for o ativo, o vizinho vira ativo. */
  deleteSpace: (id: string) => void;
  moveSpace: (id: string, toIndex: number) => void;
  updateWidget: <K extends WidgetKey>(id: string, widget: K, patch: Partial<Widgets[K]>) => void;
  resetSpaces: () => void;
}

const cleanName = (name: string) => name.trim().slice(0, MAX_SPACE_NAME_LENGTH) || "Space";

function updateSpace(spaces: Space[], id: string, update: (space: Space) => Space) {
  return spaces.map((space) => (space.id === id ? update(space) : space));
}

export const useSpacesStore = create<SpacesState>()(
  persist(
    (set, get) => ({
      spaces: createDefaultSpaces(),
      activeSpaceId: "focus",

      setActiveSpace: (id) => {
        if (get().spaces.some((s) => s.id === id)) set({ activeSpaceId: id });
      },

      createSpace: (name, icon) => {
        const { spaces } = get();
        if (spaces.length >= MAX_SPACES) return null;
        // Sem ícone pedido, usa o primeiro que nenhum espaço usa ainda.
        const used = new Set(spaces.map((s) => s.icon));
        const chosen = icon ?? spaceIcons.find((i) => !used.has(i)) ?? "home";
        const space = createSpace({ name: cleanName(name), icon: chosen });
        set((s) => ({ spaces: [...s.spaces, space] }));
        return space.id;
      },

      renameSpace: (id, name) =>
        set((s) => ({
          spaces: updateSpace(s.spaces, id, (sp) => ({ ...sp, name: cleanName(name) })),
        })),

      setSpaceIcon: (id, icon) =>
        set((s) => ({ spaces: updateSpace(s.spaces, id, (sp) => ({ ...sp, icon })) })),

      setBackground: (id, backgroundId) =>
        set((s) => ({ spaces: updateSpace(s.spaces, id, (sp) => ({ ...sp, backgroundId })) })),

      deleteSpace: (id) =>
        set((s) => {
          const index = s.spaces.findIndex((sp) => sp.id === id);
          if (index === -1 || s.spaces.length <= 1) return s;
          const spaces = s.spaces.filter((sp) => sp.id !== id);
          const activeSpaceId =
            s.activeSpaceId === id
              ? (spaces[Math.min(index, spaces.length - 1)]?.id ?? s.activeSpaceId)
              : s.activeSpaceId;
          return { spaces, activeSpaceId };
        }),

      moveSpace: (id, toIndex) => set((s) => ({ spaces: moveItem(s.spaces, id, toIndex) })),

      updateWidget: (id, widget, patch) =>
        set((s) => ({
          spaces: updateSpace(s.spaces, id, (sp) => ({
            ...sp,
            widgets: { ...sp.widgets, [widget]: { ...sp.widgets[widget], ...patch } },
          })),
        })),

      resetSpaces: () => set({ spaces: createDefaultSpaces(), activeSpaceId: "focus" }),
    }),
    persistOptions({
      name: "spaces",
      version: 1,
      schema,
      partialize: ({ spaces, activeSpaceId }) => ({ spaces, activeSpaceId }),
      repair: ({ spaces, activeSpaceId }) => {
        const unique = uniqueById(spaces);
        const active = unique.some((s) => s.id === activeSpaceId)
          ? activeSpaceId
          : (unique[0]?.id ?? activeSpaceId);
        return { spaces: unique, activeSpaceId: active };
      },
    }),
  ),
);

syncAcrossTabs(useSpacesStore);

/* --------------------------------------------------------------- selectors */

export function selectActiveSpace(state: Pick<SpacesState, "spaces" | "activeSpaceId">): Space {
  const space = state.spaces.find((s) => s.id === state.activeSpaceId) ?? state.spaces[0];
  if (!space) throw new Error("Nenhum espaço: o store garante pelo menos um.");
  return space;
}

export function useActiveSpace() {
  return useSpacesStore(selectActiveSpace);
}

// Em dev, editar um store recarrega a página: o HMR criaria uma segunda cópia do store
// e partes do app continuariam ligadas à antiga.
import.meta.hot?.accept(() => window.location.reload());
