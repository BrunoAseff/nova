import { create } from "zustand";
import {
  updateAmbientSoundLocalStorage,
  updateAmbientSoundVolumeLocalStorage,
} from "@/utils/localStorage";
import { updateAmbientSoundLocalStorageChanges } from "@/utils/localStorageChanges";

interface AmbientSoundState {
  ambientSound: string;
  ambientSoundVolume: number;
  isPlaying: boolean;
  audioRef: HTMLAudioElement | null;
  setAmbientSound: (sound: string) => void;
  setVolume: (volume: number) => void;
  play: (soundUrl?: string) => void;
  pause: () => void;
  toggle: () => void;
  toggleMute: () => void;
  togglePlayPause: () => void;
  handleVolumeChange: (values: number[]) => void;
}

export const useAmbientSound = create<AmbientSoundState>((set, get) => ({
  ambientSound: "",
  ambientSoundVolume: 50,
  isPlaying: false,
  audioRef: null,

  setAmbientSound: (soundUrl: string) => {
    const { isPlaying, audioRef } = get();

    set({ ambientSound: soundUrl });
    updateAmbientSoundLocalStorage(soundUrl);
    updateAmbientSoundLocalStorageChanges(soundUrl);

    if (isPlaying) {
      if (audioRef) {
        audioRef.src = soundUrl;
        audioRef.play();
      } else {
        get().play(soundUrl);
      }
    }
  },

  setVolume: (volume: number) => {
    const { audioRef } = get();

    set({ ambientSoundVolume: volume });
    updateAmbientSoundVolumeLocalStorage(volume);

    if (audioRef) {
      audioRef.volume = volume / 100;
    }
  },

  play: (soundUrl?: string) => {
    const { ambientSound, ambientSoundVolume, audioRef } = get();
    const urlToPlay = soundUrl ?? ambientSound;

    let audio = audioRef;
    if (!audio) {
      audio = new Audio(urlToPlay);
      audio.loop = true;
      set({ audioRef: audio });
    } else {
      audio.src = urlToPlay;
    }

    audio.volume = ambientSoundVolume / 100;
    audio.play();
    set({
      isPlaying: true,
      ambientSound: urlToPlay,
    });
  },

  pause: () => {
    const { audioRef } = get();
    if (audioRef) {
      audioRef.pause();
      set({ isPlaying: false });
    }
  },

  toggle: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      get().pause();
    } else {
      get().play();
    }
  },

  handleVolumeChange: (values: number[]) => {
    if (values[0] !== undefined) {
      get().setVolume(values[0]);
    }
  },

  toggleMute: () => {
    const { ambientSoundVolume, setVolume } = get();
    setVolume(ambientSoundVolume > 0 ? 0 : 50);
  },

  togglePlayPause: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  },
}));
