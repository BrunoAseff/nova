import { ChevronUp, Pause, Play, Volume1, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ElasticSlider } from "@/components/arc/elastic-slider/elastic-slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/arc/popover/popover";
import { Tooltip } from "@/components/arc/tooltip/tooltip";
import { Button } from "@/components/ui/Button";
import { SOUND_ICON } from "@/content/icons";
import { ambientSounds } from "@/content/sounds";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useAmbientStore } from "@/stores/ambient";

/** Três barras que respiram enquanto o som toca. */
function Playing({ active }: { active: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0.55, 1, 0.75].map((peak, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: barras fixas
          key={i}
          className="w-[2px] rounded-full bg-current"
          animate={active ? { height: ["30%", `${peak * 100}%`, "30%"] } : { height: "30%" }}
          transition={
            active
              ? { duration: 1.2 + i * 0.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
              : { duration: duration.base }
          }
        />
      ))}
    </span>
  );
}

/** L3 · Controle do som ambiente: tocar é um clique; escolher e ajustar fica no popover. */
export function SoundControl() {
  const { soundId, volume, isPlaying } = useAmbientStore();
  const { toggle, setSound, setVolume, play } = useAmbientStore.getState();
  const current = ambientSounds.find((s) => s.id === soundId) ?? ambientSounds[0];
  const CurrentIcon = SOUND_ICON[current.id];

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip content={isPlaying ? "Pause  ·  M" : "Play  ·  M"}>
        <Button
          variant="ghost"
          icon
          aria-label={isPlaying ? `Pause ${current.name}` : `Play ${current.name}`}
          onClick={toggle}
          className="text-ink"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={isPlaying ? "pause" : "play"}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: duration.quick, ease: ease.out }}
              className="flex"
            >
              {isPlaying ? <Pause /> : <Play />}
            </motion.span>
          </AnimatePresence>
        </Button>
      </Tooltip>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="gap-2.5 pr-3 pl-3 text-ink data-[state=open]:bg-[var(--fill-hover)]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={isPlaying ? "bars" : "icon"}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: duration.quick }}
                className="flex w-4 justify-center"
              >
                {isPlaying ? (
                  <Playing active />
                ) : (
                  <CurrentIcon className="text-ink-2" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
            <span className="min-w-[5.5rem] text-left">{current.name}</span>
            <ChevronUp className="text-ink-3" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="center"
          sideOffset={16}
          className="w-[22rem] !p-3"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div data-keep-awake className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Ambient sound">
              {ambientSounds.map((sound) => {
                const Icon = SOUND_ICON[sound.id];
                const selected = sound.id === soundId;
                return (
                  // biome-ignore lint/a11y/useSemanticElements: opção visual de um radiogroup (padrão ARIA)
                  <button
                    key={sound.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setSound(sound.id);
                      play();
                    }}
                    className={cn(
                      "flex h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-2xl text-[0.8125rem] transition-[background-color,box-shadow,color] duration-200",
                      selected
                        ? "bg-accent-soft text-accent"
                        : "text-ink-2 hover:bg-[var(--fill-hover)] hover:text-ink",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    {sound.name}
                  </button>
                );
              })}
            </div>
            <div className="border-t border-[var(--hairline)] px-1 pt-3 pb-1">
              <ElasticSlider
                label="Volume"
                value={volume}
                onValueChange={setVolume}
                format={(v) => `${Math.round(v)}%`}
                startIcon={<Volume1 size={16} aria-hidden="true" />}
                endIcon={<Volume2 size={16} aria-hidden="true" />}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
