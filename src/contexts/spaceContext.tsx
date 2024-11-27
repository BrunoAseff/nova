"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import type { ShortcutName, Space } from "../types";
import { initialState } from "./initialState";
import type { SpaceContextValue } from "./initialState";

const SpacesContext = createContext<SpaceContextValue>(initialState);

export function SpacesProvider({ children }: { children: React.ReactNode }) {
  const [selectedTab, setSelectedTab] = useState("Focus");
  const [spaces, setSpaces] = useState<Space[]>(initialState.spaces);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playCountRef = useRef(0);
  const [shortcut, setShortcut] = useState<ShortcutName>(initialState.shortcut);
  const [ambientSound, setAmbientSound] = useState<string>(
    initialState.ambientSound,
  );
  const [ambientSoundVolume, setAmbientSoundVolume] = useState(50);
  const [isAmbientSoundPlaying, setIsAmbientSoundPlaying] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  function updateLocalStorage(spaces: Space[]) {
    const spacesToStore = spaces.map((space) => ({
      ...space,
      icon: space.name,
    }));
    localStorage.setItem("spaces", JSON.stringify(spacesToStore));
  }

  const retrieveLocalStorage = useCallback(() => {
    const localData = localStorage.getItem("spaces");
    if (localData) {
      try {
        const parsedData = JSON.parse(localData);

        // Restore icons based on names
        const restoredSpaces = parsedData.map((space: any) => ({
          ...initialState.spaces.find((s) => s.name === space.name), // Use initial state as a base
          ...space,
          icon: initialState.spaces.find((s) => s.name === space.name)?.icon, // Restore original icon
        }));

        setSpaces(restoredSpaces);
      } catch (error) {
        console.error("Error parsing local storage data:", error);
        setSpaces(initialState.spaces);
      }
    }
  }, [setSpaces]);

  const playAmbientSound = useCallback(
    (soundUrl?: string) => {
      const urlToPlay = soundUrl ?? ambientSound;

      if (!ambientAudioRef.current) {
        ambientAudioRef.current = new Audio(urlToPlay);
        ambientAudioRef.current.loop = true;
      } else {
        ambientAudioRef.current.src = urlToPlay;
      }

      ambientAudioRef.current.volume = ambientSoundVolume / 100;
      ambientAudioRef.current.play();
      setIsAmbientSoundPlaying(true);
      setAmbientSound(urlToPlay);
    },
    [ambientSound, ambientSoundVolume],
  );

  const pauseAmbientSound = useCallback(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      setIsAmbientSoundPlaying(false);
    }
  }, []);

  const updateAmbientSound = useCallback(
    (soundUrl: string) => {
      setAmbientSound(soundUrl);

      // If currently playing, update the audio source and continue playing
      if (isAmbientSoundPlaying) {
        if (ambientAudioRef.current) {
          ambientAudioRef.current.src = soundUrl;
          ambientAudioRef.current.play();
        } else {
          playAmbientSound(soundUrl);
        }
      }
    },
    [isAmbientSoundPlaying, playAmbientSound],
  );

  const updateAmbientSoundVolume = useCallback((volume: number) => {
    setAmbientSoundVolume(volume);

    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = volume / 100;
    }
  }, []);

  const toggleAmbientSound = useCallback(() => {
    if (isAmbientSoundPlaying) {
      pauseAmbientSound();
    } else {
      playAmbientSound();
    }
  }, [isAmbientSoundPlaying, playAmbientSound, pauseAmbientSound]);

  const updateShortcut = useCallback((newShortcut: ShortcutName) => {
    setShortcut(newShortcut);
  }, []);

  function selectTab(tab: string) {
    setSelectedTab(tab);
  }

  function updateSpaceProperty(
    spaceName: string,
    propertyName: keyof Space,
    value: any,
  ) {
    setSpaces((prevSpaces) => {
      const updatedSpaces = prevSpaces.map((space) =>
        space.name === spaceName ? { ...space, [propertyName]: value } : space,
      );
      updateLocalStorage(updatedSpaces);
      return updatedSpaces;
    });
  }

  function updateSpaceSharedProperty(propertyName: "isHidden", value: boolean) {
    setSpaces((prevSpaces) => {
      const updatedSpaces = prevSpaces.map((space) => ({
        ...space,
        [propertyName]: value,
      }));
      updateLocalStorage(updatedSpaces);
      return updatedSpaces;
    });
  }

  async function playPomodoroAlarm() {
    try {
      const currentSpace = spaces.find((space) => space.name === selectedTab);

      if (!currentSpace?.pomodoro.alarmSound) {
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio(currentSpace.pomodoro.alarmSoundURL);

        // Reset play count and play again when audio ends
        audioRef.current.addEventListener("ended", () => {
          playCountRef.current += 1;

          if (playCountRef.current < currentSpace.pomodoro.alarmRepeatTimes) {
            audioRef.current?.play();
          } else {
            stopPomodoroAlarm({ currentSpace });
          }
        });
      }

      // Reset play count when starting new alarm
      playCountRef.current = 0;
      setIsAlarmPlaying(true);

      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (error) {
      console.error("Failed to play pomodoro alarm:", error);
      setIsAlarmPlaying(false);
    }
  }

  function stopPomodoroAlarm({ currentSpace }: { currentSpace: Space }) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      playCountRef.current = currentSpace.pomodoro.alarmRepeatTimes;
    } else {
      // Prevent further plays
      setIsAlarmPlaying(false);
    }
  }

  const value: SpaceContextValue = {
    spaces,
    selectedTab,
    selectTab,
    updateSpaceProperty,
    updateSpaceSharedProperty,
    playPomodoroAlarm,
    stopPomodoroAlarm,
    isAlarmPlaying,
    updateShortcut,
    shortcut,
    ambientSound,
    ambientSoundVolume,
    isAmbientSoundPlaying,
    playAmbientSound,
    pauseAmbientSound,
    updateAmbientSound,
    updateAmbientSoundVolume,
    toggleAmbientSound,
    updateLocalStorage,
    retrieveLocalStorage,
  };

  return (
    <SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>
  );
}

export const useSpacesContext = () => useContext(SpacesContext);
