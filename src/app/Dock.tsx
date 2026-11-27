import { ChevronUp, LayoutGrid, Moon, Pause, Play, SlidersHorizontal, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Tooltip } from "@/components/arc/tooltip/tooltip";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Tabs } from "@/components/ui/Tabs";
import { SOUND_ICON, SPACE_ICON } from "@/content/icons";
import { ambientSounds } from "@/content/sounds";
import { calm, duration, ease } from "@/lib/motion";
import { useLayoutMode } from "@/lib/useLayoutMode";
import { cn } from "@/lib/utils";
import { useAmbientStore } from "@/stores/ambient";
import { useAttentionStore } from "@/stores/attention";
import { usePreferencesStore } from "@/stores/preferences";
import { useActiveSpace, useSpacesStore } from "@/stores/spaces";
import { Playing, SoundControl, SoundPicker } from "./SoundControl";

function Divider() {
  return <span className="mx-1.5 h-6 w-px bg-[var(--hairline)]" aria-hidden="true" />;
}

/**
 * L3 · Controles. Aparece com intenção e some em repouso (P1), devagar e sem pressa:
 * desce um pouco e esmaece. (Sem `filter`: quebraria o backdrop-filter do vidro.)
 * Nunca some com o ponteiro ou o foco em cima.
 */
export function Dock() {
  const attention = useAttentionStore((s) => s.attention);
  const arranging = useAttentionStore((s) => s.arranging);
  // Some em repouso e enquanto o espaço é arranjado (a barra de arranjar fica no alto).
  const hidden = attention === "rest" || arranging;
  const compact = useLayoutMode() !== "grid";

  return (
    <motion.nav
      aria-label="Spaces and controls"
      data-keep-awake
      initial={false}
      animate={{ y: hidden ? 16 : 0 }}
      transition={calm}
      style={{ pointerEvents: hidden ? "none" : "auto" }}
      className="absolute inset-x-0 bottom-[clamp(1rem,3vh,2rem)] z-20 mx-auto flex w-fit"
    >
      {/* A opacidade fica no próprio vidro: num ancestral ela apagaria o desfoque. */}
      <motion.div
        initial={false}
        animate={{ opacity: hidden ? 0 : 1 }}
        transition={calm}
        className="glass flex items-center rounded-full p-1.5"
      >
        {compact ? <CompactControls /> : <FullControls />}
      </motion.div>
    </motion.nav>
  );
}

/** O dock do computador: espaços em abas, som, tema, arrumar e configurações. */
function FullControls() {
  const spaces = useSpacesStore((s) => s.spaces);
  const activeSpaceId = useSpacesStore((s) => s.activeSpaceId);
  const setActiveSpace = useSpacesStore((s) => s.setActiveSpace);
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const setPanelOpen = useAttentionStore((s) => s.setPanelOpen);
  const setArranging = useAttentionStore((s) => s.setArranging);
  return (
    <>
      <Tabs
        label="Space"
        value={activeSpaceId}
        onChange={setActiveSpace}
        className="bg-transparent shadow-none"
        options={spaces.map((space) => {
          const Icon = SPACE_ICON[space.icon];
          return { value: space.id, label: space.name, icon: <Icon aria-hidden="true" /> };
        })}
      />
      <Divider />
      <SoundControl />
      <Divider />
      <Tooltip content={theme === "light" ? "Dark mode" : "Light mode"}>
        <Button
          variant="ghost"
          icon
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="flex"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </Tooltip>
      <Tooltip content="Arrange  ·  E">
        <Button
          variant="ghost"
          icon
          aria-label="Arrange this space"
          onClick={() => setArranging(true)}
        >
          <LayoutGrid />
        </Button>
      </Tooltip>
      <Tooltip content="Settings  ·  ,">
        <Button variant="ghost" icon aria-label="Open settings" onClick={() => setPanelOpen(true)}>
          <SlidersHorizontal />
        </Button>
      </Tooltip>
    </>
  );
}

/**
 * O dock do celular, numa barra que cabe em 320px: o espaço atual abre a lista de
 * espaços, o som toca e pausa (e abre a escolha do som), e as configurações. Tema e
 * "arrumar" ficam dentro das configurações.
 */
function CompactControls() {
  const space = useActiveSpace();
  const spaces = useSpacesStore((s) => s.spaces);
  const setActiveSpace = useSpacesStore((s) => s.setActiveSpace);
  const setPanelOpen = useAttentionStore((s) => s.setPanelOpen);
  const { soundId, isPlaying } = useAmbientStore();
  const sound = ambientSounds.find((s) => s.id === soundId) ?? ambientSounds[0];
  const SoundIcon = SOUND_ICON[sound.id];
  const [sheet, setSheet] = useState<"spaces" | "sound" | null>(null);
  const Icon = SPACE_ICON[space.icon];

  return (
    <>
      <Button
        variant="ghost"
        className="gap-2 pr-2.5 pl-3 text-ink"
        aria-label={`Space: ${space.name}. Change space`}
        onClick={() => setSheet("spaces")}
      >
        <Icon className="text-accent" aria-hidden="true" />
        <span className="max-w-[7rem] truncate">{space.name}</span>
        <ChevronUp className="text-ink-3" aria-hidden="true" />
      </Button>
      <Divider />
      <Button
        variant="ghost"
        icon
        className="text-ink"
        aria-label={isPlaying ? `Pause ${sound.name}` : `Play ${sound.name}`}
        onClick={() => useAmbientStore.getState().toggle()}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <Button
        variant="ghost"
        className="gap-1.5 px-2.5 text-ink"
        aria-label={`Ambient sound: ${sound.name}. Change sound`}
        onClick={() => setSheet("sound")}
      >
        <span className="flex w-4 justify-center">
          {isPlaying ? <Playing active /> : <SoundIcon className="text-ink-2" aria-hidden="true" />}
        </span>
        <ChevronUp className="text-ink-3" aria-hidden="true" />
      </Button>
      <Divider />
      <Button variant="ghost" icon aria-label="Open settings" onClick={() => setPanelOpen(true)}>
        <SlidersHorizontal />
      </Button>

      <Sheet
        open={sheet === "spaces"}
        onOpenChange={(open) => setSheet(open ? "spaces" : null)}
        title="Spaces"
      >
        <div className="flex flex-col gap-1 px-4 pb-6">
          {spaces.map((item) => {
            const ItemIcon = SPACE_ICON[item.icon];
            const active = item.id === space.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active}
                onClick={() => {
                  setActiveSpace(item.id);
                  setSheet(null);
                }}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-xl px-3 text-left text-[0.9375rem]",
                  active
                    ? "bg-accent-soft font-medium text-ink"
                    : "text-ink active:bg-[var(--fill-hover)]",
                )}
              >
                <ItemIcon
                  className={cn("size-[1.1rem]", active ? "text-accent" : "text-ink-3")}
                  aria-hidden="true"
                />
                <span className="flex-1 truncate">{item.name}</span>
                {active && <span className="text-[0.75rem] font-medium text-accent">Current</span>}
              </button>
            );
          })}
          <p className="px-3 pt-2 text-[0.8125rem] text-ink-3">Or swipe sideways on the screen.</p>
        </div>
      </Sheet>

      <Sheet
        open={sheet === "sound"}
        onOpenChange={(open) => setSheet(open ? "sound" : null)}
        title="Ambient sound"
      >
        <div className="px-4 pb-6">
          <SoundPicker />
        </div>
      </Sheet>
    </>
  );
}
