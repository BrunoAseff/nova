"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import type { ReminderMessage, ShortcutName, Space } from "../types";
import {
  updateAmbientSoundLocalStorage,
  updateAmbientSoundVolumeLocalStorage,
  updateLocalStorage,
  updateReminderMessagesLocalStorage,
  updateShortcutLocalStorage,
} from "@/utils/localStorage";
import type { SpaceContextValue } from "@/types/settings";
import { settings } from "./settings";

const SpacesContext = createContext({} as SpaceContextValue);

export function SpacesProvider({ children }: { children: React.ReactNode }) {
  const [selectedTab, setSelectedTab] = useState(2); // Default to first space ID
  const [spaces, setSpaces] = useState<Space[]>(settings.spaces);
  const [reminderMessages, setReminderMessages] = useState<ReminderMessage[]>(
    settings.reminderMessages,
  );
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playCountRef = useRef(0);
  const [shortcut, setShortcut] = useState<ShortcutName>(settings.shortcut);
  const [ambientSound, setAmbientSound] = useState<string>(
    settings.ambientSound,
  );
  const [ambientSoundVolume, setAmbientSoundVolume] = useState(50);
  const [isAmbientSoundPlaying, setIsAmbientSoundPlaying] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  function resetSpaces() {
    localStorage.removeItem("spaces");
    localStorage.removeItem("shortcut");
    localStorage.removeItem("ambientSound");
    localStorage.removeItem("reminderMessages");
    setShortcut(settings.shortcut);
    setAmbientSound(settings.ambientSound);
    setSpaces(settings.spaces);
    setReminderMessages(settings.reminderMessages);
  }

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
      updateAmbientSoundLocalStorage(soundUrl);

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
    updateAmbientSoundVolumeLocalStorage(volume);

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
    updateShortcutLocalStorage(newShortcut);
  }, []);

  const updateReminder = useCallback(
    (newReminder: ReminderMessage) => {
      const updatedReminders = [...reminderMessages, newReminder];
      setReminderMessages(updatedReminders);
      updateReminderMessagesLocalStorage(updatedReminders);
    },
    [reminderMessages],
  );

  const deleteReminder = useCallback(
    (id: string) => {
      const updatedReminders = reminderMessages.filter(
        (reminder) => reminder?.id !== id,
      );
      setReminderMessages(updatedReminders);
      updateReminderMessagesLocalStorage(updatedReminders);
    },
    [reminderMessages],
  );

  const updateReminderType = useCallback(
    (id: string, newType: ReminderMessage["type"]) => {
      const updatedReminders = reminderMessages.map((reminder) =>
        reminder?.id === id ? { ...reminder, type: newType } : reminder,
      );
      setReminderMessages(updatedReminders);
      updateReminderMessagesLocalStorage(updatedReminders);
    },
    [reminderMessages],
  );

  const updateReminderText = useCallback(
    (id: string, newText: string) => {
      const updatedReminders = reminderMessages.map((reminder) =>
        reminder?.id === id ? { ...reminder, text: newText } : reminder,
      );
      setReminderMessages(updatedReminders);
      updateReminderMessagesLocalStorage(updatedReminders);
    },
    [reminderMessages],
  );

  function selectTab(tabId: number) {
    setSelectedTab(tabId);
  }

  function modifySpaces(callback: (space: Space) => Space) {
    setSpaces((prevSpaces) => {
      const updatedSpaces = prevSpaces.map(callback);
      updateLocalStorage(updatedSpaces);
      return updatedSpaces;
    });
  }

  function updateSpaceProperty(
    spaceId: number, // Changed from spaceName to spaceId
    propertyName: keyof Space,
    value: any,
  ) {
    modifySpaces((space) => {
      if (space.id === spaceId) {
        // Don't update the icon if that's the property being changed
        if (propertyName === "icon") {
          console.warn("Icon property should not be directly modified");
          return space;
        }
        return { ...space, [propertyName]: value };
      }
      return space;
    });
  }

  function updateSpaceSharedProperty(propertyName: "isHidden", value: boolean) {
    modifySpaces((space) => ({ ...space, [propertyName]: value }));
  }

  function initializeAudio(url: string, onEndCallback: () => void) {
    const audio = new Audio(url);
    audio.addEventListener("ended", onEndCallback);
    return audio;
  }

  async function playPomodoroAlarm() {
    const currentSpace = spaces.find((space) => space.id === selectedTab);

    if (!currentSpace?.pomodoro.alarmSoundURL) return;

    if (!audioRef.current) {
      audioRef.current = initializeAudio(
        currentSpace.pomodoro.alarmSoundURL,
        () => {
          playCountRef.current++;
          if (playCountRef.current < currentSpace.pomodoro.alarmRepeatTimes) {
            audioRef.current?.play();
          } else {
            stopPomodoroAlarm({ currentSpace });
          }
        },
      );
    }

    playCountRef.current = 0;
    setIsAlarmPlaying(true);
    audioRef.current.currentTime = 0;

    try {
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
    setSpaces,
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
    resetSpaces,
    setShortcut,
    setAmbientSound,
    setAmbientSoundVolume,
    reminderMessages,
    setReminderMessages,
    updateReminder,
    deleteReminder,
    updateReminderType,
    updateReminderText,
  };

  return (
    <SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>
  );
}

export const useSpacesContext = () => useContext(SpacesContext);
