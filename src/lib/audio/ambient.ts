import { ambientSounds, getSoundSrc } from "@/content/sounds";
import { useAmbientStore } from "@/stores/ambient";

/**
 * Motor do som ambiente. O `HTMLAudioElement` vive aqui, fora do estado:
 * o store diz o que tocar e em que volume, e este módulo obedece.
 * (Pré-carregamento, loop sem gap e crossfade entram no item 5 do roadmap.)
 */
let audio: HTMLAudioElement | null = null;
let started = false;

function element() {
  audio ??= Object.assign(new Audio(), { loop: true, preload: "auto" });
  return audio;
}

function apply(state = useAmbientStore.getState()) {
  const src = getSoundSrc(ambientSounds, state.soundId);

  if (!state.isPlaying) {
    audio?.pause();
    return;
  }

  if (!src) {
    // Ainda não há arquivo para este som (item 5). Não finge que está tocando.
    useAmbientStore.getState().pause();
    return;
  }

  const el = element();
  el.volume = state.volume / 100;
  if (el.getAttribute("src") !== src) el.src = src;
  el.play().catch(() => {
    // Autoplay bloqueado ou arquivo com erro: volta o estado para "parado".
    useAmbientStore.getState().pause();
  });
}

export function startAmbientEngine() {
  if (started) return;
  started = true;

  useAmbientStore.subscribe((state, prev) => {
    if (state.volume !== prev.volume && audio) audio.volume = state.volume / 100;
    if (state.isPlaying !== prev.isPlaying || state.soundId !== prev.soundId) apply(state);
  });
}
