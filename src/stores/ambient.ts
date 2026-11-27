import { z } from "zod/mini";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AmbientSoundId, ambientSoundIds, DEFAULT_AMBIENT_SOUND_ID } from "@/content/sounds";
import { persistOptions, syncAcrossTabs } from "./lib/persisted";

const schema = z.object({
  soundId: z.catch(z.enum(ambientSoundIds), DEFAULT_AMBIENT_SOUND_ID),
  volume: z.catch(z.number().check(z.minimum(0), z.maximum(100)), 50),
});

type Persisted = z.infer<typeof schema>;

interface AmbientState extends Persisted {
  /** Runtime: não é salvo. O navegador bloqueia autoplay, então sempre começa parado. */
  isPlaying: boolean;
  setSound: (soundId: AmbientSoundId) => void;
  setVolume: (volume: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

/** Som ambiente global: um só, que continua tocando ao trocar de espaço. */
export const useAmbientStore = create<AmbientState>()(
  persist(
    (set) => ({
      soundId: DEFAULT_AMBIENT_SOUND_ID,
      volume: 50,
      isPlaying: false,
      setSound: (soundId) => set({ soundId }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
    }),
    persistOptions({
      name: "ambient",
      version: 1,
      schema,
      partialize: ({ soundId, volume }) => ({ soundId, volume }),
    }),
  ),
);

syncAcrossTabs(useAmbientStore);

// Em dev, editar um store recarrega a página: o HMR criaria uma segunda cópia do store
// e partes do app continuariam ligadas à antiga.
import.meta.hot?.accept(() => window.location.reload());
