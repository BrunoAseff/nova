import { z } from "zod/mini";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type BackgroundId,
  backgroundIds,
  backgroundOr,
  DEFAULT_BACKGROUND_ID,
} from "@/content/backgrounds";
import { breathingTechniqueIds } from "@/content/breathing";
import { alarmSoundIds, DEFAULT_ALARM_SOUND_ID } from "@/content/sounds";
import { type SpaceIcon, spaceIcons } from "@/content/space-icons";
import {
  LEGACY_POSITION_PLACE,
  type Place,
  type PlacedWidget,
  placedWidgets,
  type WidgetSize,
  widgetSizes,
} from "@/content/widgets";
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

const fraction = z.number().check(z.minimum(0), z.maximum(1));
const placeSchema = z.object({ x: fraction, y: fraction });
const place = (x: number, y: number) => z.catch(placeSchema, { x, y });
const size = (fallback: (typeof widgetSizes)[number]) => z.catch(z.enum(widgetSizes), fallback);
const minutes = z.int().check(z.minimum(1), z.maximum(180));

const clockSchema = z.object({
  visible: z.catch(z.boolean(), true),
  place: place(0.5, 0.5),
  size: size("l"),
  format: z.catch(z.enum(["12h", "24h"]), "24h"),
});

const alarmSchema = z.object({
  enabled: z.catch(z.boolean(), true),
  soundId: z.catch(z.enum(alarmSoundIds), DEFAULT_ALARM_SOUND_ID),
  repeat: z.catch(z.int().check(z.minimum(1), z.maximum(10)), 3),
});

const pomodoroSchema = z.object({
  visible: z.catch(z.boolean(), false),
  place: place(1, 1),
  size: size("m"),
  focusMin: z.catch(minutes, 25),
  shortBreakMin: z.catch(minutes, 5),
  longBreakMin: z.catch(minutes, 15),
  autoStart: z.catch(z.boolean(), false),
  alarm: z.catch(alarmSchema, defaultsOf(alarmSchema)),
});

const quoteSchema = z.object({
  visible: z.catch(z.boolean(), false),
  place: place(0, 1),
  size: size("m"),
});

const breathingSchema = z.object({
  visible: z.catch(z.boolean(), false),
  place: place(1, 0),
  size: size("s"),
  technique: z.catch(z.enum(breathingTechniqueIds), "box"),
});

const remindersSchema = z.object({
  visible: z.catch(z.boolean(), false),
  place: place(0, 0),
  size: size("m"),
});

const widgetsSchema = z.object({
  clock: z.catch(clockSchema, defaultsOf(clockSchema)),
  pomodoro: z.catch(pomodoroSchema, defaultsOf(pomodoroSchema)),
  quote: z.catch(quoteSchema, defaultsOf(quoteSchema)),
  breathing: z.catch(breathingSchema, defaultsOf(breathingSchema)),
  reminders: z.catch(remindersSchema, defaultsOf(remindersSchema)),
});

/**
 * O layout do celular (coluna), à parte do layout da grade: a ordem e o tamanho que o
 * usuário escolheu no celular. Vazio = deriva da grade (ver `app/layout/compact.ts`).
 */
const compactSchema = z.object({
  order: z.catch(z.array(z.enum(placedWidgets)), []),
  sizes: z.catch(z.partialRecord(z.enum(placedWidgets), z.enum(widgetSizes)), {}),
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
  compact: z.catch(compactSchema, defaultsOf(compactSchema)),
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
    compact: { order: [], sizes: {} },
    ...fields,
  };
}

/**
 * Os três espaços iniciais. Uma função (e não uma constante) para cada uso ter a sua cópia.
 * Cada widget tem um lugar próprio, mesmo os desligados: ligar um (ou o "Reset" do modo
 * de arranjar) já cai num canto pensado, sem amontoar tudo no centro.
 */
export function createDefaultSpaces(): Space[] {
  const home = defaultWidgets();
  home.clock = { ...home.clock, visible: true, place: { x: 0.5, y: 0.5 }, size: "l" };
  home.quote = { visible: true, place: { x: 0, y: 1 }, size: "m" };
  home.reminders = { visible: false, place: { x: 0, y: 0 }, size: "m" };
  home.pomodoro = { ...home.pomodoro, place: { x: 1, y: 1 }, size: "s" };
  home.breathing = { ...home.breathing, place: { x: 1, y: 0 }, size: "s" };

  const focus = defaultWidgets();
  focus.pomodoro = { ...focus.pomodoro, visible: true, place: { x: 0.5, y: 0.5 }, size: "l" };
  focus.clock = { ...focus.clock, visible: false, place: { x: 1, y: 0 }, size: "s" };
  focus.reminders = { visible: true, place: { x: 0, y: 0 }, size: "m" };
  focus.quote = { visible: false, place: { x: 0, y: 1 }, size: "s" };
  focus.breathing = { ...focus.breathing, place: { x: 1, y: 1 }, size: "s" };

  const relax = defaultWidgets();
  relax.breathing = { ...relax.breathing, visible: true, place: { x: 0.5, y: 0.5 }, size: "l" };
  relax.clock = { ...relax.clock, visible: false, place: { x: 0, y: 1 }, size: "s" };
  relax.quote = { visible: true, place: { x: 1, y: 0 }, size: "m" };
  relax.reminders = { visible: false, place: { x: 0, y: 0 }, size: "m" };
  relax.pomodoro = { ...relax.pomodoro, place: { x: 1, y: 1 }, size: "s" };

  return [
    createSpace({ id: "home", name: "Home", icon: "home", widgets: home }),
    // Cada espaço tem o seu fundo. Enquanto o catálogo definitivo não chega (item 4), em
    // produção todos caem no mesmo; no protótipo já começam diferentes.
    createSpace({
      id: "focus",
      name: "Focus",
      icon: "focus",
      backgroundId: backgroundOr("study-desk"),
      widgets: focus,
    }),
    createSpace({
      id: "relax",
      name: "Relax",
      icon: "relax",
      backgroundId: backgroundOr("spring-mountains"),
      widgets: relax,
    }),
  ];
}

/* --------------------------------------------------------------- migração */

/**
 * v1 → v2: os widgets tinham `position` (quatro cantos e o centro); agora têm `place`
 * (um ponto da grade) e `size`. Converte as posições salvas; o resto o schema completa.
 */
function migrateSpaces(persisted: unknown, version: number): unknown {
  if (version >= 2 || !persisted || typeof persisted !== "object") return persisted;
  const spaces = (persisted as { spaces?: unknown }).spaces;
  if (!Array.isArray(spaces)) return persisted;
  for (const space of spaces) {
    const widgets = (space as { widgets?: Record<string, Record<string, unknown>> }).widgets;
    if (!widgets) continue;
    for (const widget of Object.values(widgets)) {
      const old = typeof widget.position === "string" ? widget.position : undefined;
      const converted: Place | undefined = old ? LEGACY_POSITION_PLACE[old] : undefined;
      if (converted) widget.place = converted;
      delete widget.position;
    }
  }
  return persisted;
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
  /** Volta lugar e tamanho dos widgets do espaço ao layout inicial (o resto fica). */
  resetLayout: (id: string) => void;
  /** Ordem dos widgets na coluna do celular. */
  setCompactOrder: (id: string, order: PlacedWidget[]) => void;
  /** Tamanho de um widget no celular (não mexe no da grade). */
  setCompactSize: (id: string, widget: PlacedWidget, size: WidgetSize) => void;
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

      resetLayout: (id) =>
        set((s) => ({
          spaces: updateSpace(s.spaces, id, (sp) => {
            const initial =
              createDefaultSpaces().find((d) => d.id === id)?.widgets ?? defaultWidgets();
            const widgets = { ...sp.widgets };
            for (const key of placedWidgets) {
              const { place, size } = initial[key];
              widgets[key] = { ...widgets[key], place, size } as never;
            }
            return { ...sp, widgets, compact: { order: [], sizes: {} } };
          }),
        })),

      setCompactOrder: (id, order) =>
        set((s) => ({
          spaces: updateSpace(s.spaces, id, (sp) => ({ ...sp, compact: { ...sp.compact, order } })),
        })),

      setCompactSize: (id, widget, size) =>
        set((s) => ({
          spaces: updateSpace(s.spaces, id, (sp) => ({
            ...sp,
            compact: { ...sp.compact, sizes: { ...sp.compact.sizes, [widget]: size } },
          })),
        })),

      resetSpaces: () => set({ spaces: createDefaultSpaces(), activeSpaceId: "focus" }),
    }),
    persistOptions({
      name: "spaces",
      // v3: `compact` (layout do celular). Só campos novos com padrão: nada a converter.
      version: 3,
      migrate: migrateSpaces,
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
