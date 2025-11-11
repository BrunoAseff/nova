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
import {
  updateSpace as apiUpdateSpace,
  updateShortcut as apiUpdateShortcut,
  createReminder as apiCreateReminder,
  updateReminder as apiUpdateReminder,
  deleteReminder as apiDeleteReminder,
} from "@/utils/settingsApi";
import { useSession } from "next-auth/react";
import { logger } from "@/utils/logger";

const SpacesContext = createContext({} as SpaceContextValue);

export function SpacesProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [selectedTab, setSelectedTab] = useState(2);
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

  const updateShortcut = useCallback(
    async (newShortcut: ShortcutName): Promise<void> => {
      setShortcut(newShortcut);
      updateShortcutLocalStorage(newShortcut);

      if (session?.user?.id) {
        try {
          await apiUpdateShortcut(newShortcut);
        } catch (error) {
          logger.error("Failed to update shortcut:", error);
        }
      }
    },
    [session?.user?.id],
  );

  const updateReminder = useCallback(
    async (newReminder: ReminderMessage): Promise<void> => {
      const updatedReminders = [...reminderMessages, newReminder];
      setReminderMessages(updatedReminders);
      updateReminderMessagesLocalStorage(updatedReminders);

      if (session?.user?.id) {
        try {
          await apiCreateReminder(
            newReminder.id,
            newReminder.text,
            newReminder.type,
          );
        } catch (error) {
          logger.error("Failed to create reminder:", error);
          setReminderMessages(reminderMessages);
        }
      }
    },
    [reminderMessages, session?.user?.id],
  );

  const deleteReminder = useCallback(
    async (id: string): Promise<void> => {
      const updatedReminders = reminderMessages.filter(
        (reminder) => reminder?.id !== id,
      );
      setReminderMessages(updatedReminders);
      updateReminderMessagesLocalStorage(updatedReminders);

      if (session?.user?.id) {
        try {
          await apiDeleteReminder(id);
        } catch (error) {
          logger.error("Failed to delete reminder:", error);
          setReminderMessages(reminderMessages);
        }
      }
    },
    [reminderMessages, session?.user?.id],
  );

  const updateReminderType = useCallback(
    async (id: string, newType: ReminderMessage["type"]): Promise<void> => {
      const updatedReminders = reminderMessages.map((reminder) =>
        reminder?.id === id ? { ...reminder, type: newType } : reminder,
      );
      setReminderMessages(updatedReminders);
      updateReminderMessagesLocalStorage(updatedReminders);

      if (session?.user?.id) {
        try {
          await apiUpdateReminder(id, undefined, newType);
        } catch (error) {
          logger.error("Failed to update reminder type:", error);
          setReminderMessages(reminderMessages);
        }
      }
    },
    [reminderMessages, session?.user?.id],
  );

  const updateReminderText = useCallback(
    async (id: string, newText: string): Promise<void> => {
      const updatedReminders = reminderMessages.map((reminder) =>
        reminder?.id === id ? { ...reminder, text: newText } : reminder,
      );
      setReminderMessages(updatedReminders);
      updateReminderMessagesLocalStorage(updatedReminders);

      if (session?.user?.id) {
        try {
          await apiUpdateReminder(id, newText, undefined);
        } catch (error) {
          logger.error("Failed to update reminder text:", error);
          setReminderMessages(reminderMessages);
        }
      }
    },
    [reminderMessages, session?.user?.id],
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

  const updateSpaceProperty = useCallback(
    async (
      spaceId: number,
      propertyName: keyof Space,
      value: any,
    ): Promise<void> => {
      if (propertyName === "icon") {
        logger.warn("Icon property should not be directly modified");
        return;
      }

      modifySpaces((space) => {
        if (space.id === spaceId) {
          return { ...space, [propertyName]: value };
        }
        return space;
      });

      if (session?.user?.id) {
        try {
          await apiUpdateSpace(spaceId, propertyName, value);
        } catch (error) {
          logger.error("Failed to update space property:", error);
        }
      }
    },
    [session?.user?.id],
  );

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
      setIsAlarmPlaying(false);
    }
  }

  const value: SpaceContextValue = {
    spaces,
    setSpaces,
    selectedTab,
    selectTab,
    updateSpaceProperty: updateSpaceProperty as (
      spaceId: number,
      propertyName: keyof Space,
      value: any,
    ) => Promise<void>,
    playPomodoroAlarm,
    stopPomodoroAlarm,
    isAlarmPlaying,
    updateShortcut: updateShortcut as (
      newShortcut: ShortcutName,
    ) => Promise<void>,
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
    updateReminder: updateReminder as (
      newReminder: ReminderMessage,
    ) => Promise<void>,
    deleteReminder: deleteReminder as (id: string) => Promise<void>,
    updateReminderType: updateReminderType as (
      id: string,
      newType: ReminderMessage["type"],
    ) => Promise<void>,
    updateReminderText: updateReminderText as (
      id: string,
      newText: string,
    ) => Promise<void>,
  };

  return (
    <SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>
  );
}

export const useSpacesContext = () => useContext(SpacesContext);
