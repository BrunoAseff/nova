import { LayoutGrid, Moon, SlidersHorizontal, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Tooltip } from "@/components/arc/tooltip/tooltip";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { SPACE_ICON } from "@/content/icons";
import { calm, duration, ease } from "@/lib/motion";
import { useAttentionStore } from "@/stores/attention";
import { usePreferencesStore } from "@/stores/preferences";
import { useSpacesStore } from "@/stores/spaces";
import { SoundControl } from "./SoundControl";

function Divider() {
  return <span className="mx-1.5 h-6 w-px bg-[var(--hairline)]" aria-hidden="true" />;
}

/**
 * L3 · Controles. Aparece com intenção e some em repouso (P1), devagar e sem pressa:
 * desce um pouco e esmaece. (Sem `filter`: quebraria o backdrop-filter do vidro.)
 * Nunca some com o ponteiro ou o foco em cima.
 */
export function Dock() {
  const spaces = useSpacesStore((s) => s.spaces);
  const activeSpaceId = useSpacesStore((s) => s.activeSpaceId);
  const setActiveSpace = useSpacesStore((s) => s.setActiveSpace);
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const attention = useAttentionStore((s) => s.attention);
  const setPanelOpen = useAttentionStore((s) => s.setPanelOpen);
  const arranging = useAttentionStore((s) => s.arranging);
  const setArranging = useAttentionStore((s) => s.setArranging);
  // Some em repouso e enquanto o espaço é arranjado (a barra de arranjar fica no alto).
  const hidden = attention === "rest" || arranging;

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
          <Button
            variant="ghost"
            icon
            aria-label="Open settings"
            onClick={() => setPanelOpen(true)}
          >
            <SlidersHorizontal />
          </Button>
        </Tooltip>
      </motion.div>
    </motion.nav>
  );
}
