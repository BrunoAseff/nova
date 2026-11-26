/**
 * Catálogos de sons. O estado guarda só o `id`.
 * `src` fica vazio até o item 5 do roadmap, que traz arquivos novos e comprimidos.
 * Enquanto não houver `src`, o motor de áudio simplesmente não toca.
 */
interface Sound {
  id: string;
  name: string;
  src?: string;
}

export const ambientSounds = [
  { id: "ocean-waves", name: "Ocean Waves" },
  { id: "rain", name: "Rain" },
  { id: "heavy-rain", name: "Heavy Rain" },
  { id: "birds", name: "Birds" },
  { id: "fire", name: "Fire" },
  { id: "beach", name: "Beach" },
  { id: "tropical", name: "Tropical" },
  { id: "crowded-cafe", name: "Crowded Cafe" },
  { id: "underwater", name: "Underwater" },
] as const satisfies readonly Sound[];

export const alarmSounds = [
  { id: "calming", name: "Calming" },
  { id: "flute", name: "Flute" },
  { id: "digital-clock", name: "Digital Clock" },
  { id: "retro-game", name: "Retro Game" },
  { id: "rooster", name: "Rooster" },
] as const satisfies readonly Sound[];

export type AmbientSoundId = (typeof ambientSounds)[number]["id"];
export type AlarmSoundId = (typeof alarmSounds)[number]["id"];

export const ambientSoundIds = ambientSounds.map((s) => s.id) as [
  AmbientSoundId,
  ...AmbientSoundId[],
];
export const alarmSoundIds = alarmSounds.map((s) => s.id) as [AlarmSoundId, ...AlarmSoundId[]];

export const DEFAULT_AMBIENT_SOUND_ID: AmbientSoundId = "ocean-waves";
export const DEFAULT_ALARM_SOUND_ID: AlarmSoundId = "calming";

/**
 * Só no protótipo (dev): toca versões curtas em Opus geradas a partir dos WAVs do v1, em
 * `media/prototype-sounds/` (fora do git). Em produção continua sem som até o item 5.
 */
function devSrc(sounds: readonly Sound[], id: string) {
  if (!import.meta.env.DEV) return undefined;
  return sounds === (alarmSounds as readonly Sound[])
    ? `/media/prototype-sounds/alarm-${id}.opus`
    : `/media/prototype-sounds/${id}.opus`;
}

export function getSoundSrc(sounds: readonly Sound[], id: string): string | undefined {
  return sounds.find((s) => s.id === id)?.src ?? devSrc(sounds, id);
}
