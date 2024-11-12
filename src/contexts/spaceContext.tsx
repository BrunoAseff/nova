/* eslint-disable @typescript-eslint/no-empty-function */
"use client";
import { createContext, useContext, useState, useRef } from "react";
import type { Space } from "../types";
import { Home } from "@/components/icons/Home";
import { Focus } from "@/components/icons/Focus";
import { Relax } from "@/components/icons/Relax";

const DEFAULT_ALARM_SOUND = "/alarm-sounds/calming-alarm.wav";

export interface SpaceContextValue {
  spaces: Space[];
  selectedTab: string;
  selectTab: (tab: string) => void;
  updateSpaceProperty: (
    spaceName: string,
    propertyName: keyof Space,
    value: any,
  ) => void;
  updateSpaceSharedProperty: (propertyName: "isHidden", value: boolean) => void;
  playPomodoroAlarm: () => Promise<void>;
  stopPomodoroAlarm: ({ currentSpace }: { currentSpace: Space }) => void;
  isAlarmPlaying: boolean;
}

const initialState: SpaceContextValue = {
  spaces: [
    {
      name: "Home",
      icon: <Home color="currentColor" />,
      clock: { isHidden: false, position: "center", timeFormat: "24h" },
      pomodoro: {
        isHidden: true,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStart: false,
        alarmSound: true,
        alarmSoundURL: DEFAULT_ALARM_SOUND,
        alarmRepeatTimes: 3,
      },
      timer: { isHidden: true },
      quote: { position: "bottom-left", isHidden: false },
      background: "/backgrounds/home.webp",
    },
    {
      name: "Focus",
      icon: <Focus color="currentColor" />,
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      pomodoro: {
        isHidden: false,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStart: false,
        alarmSound: true,
        alarmSoundURL: DEFAULT_ALARM_SOUND,
        alarmRepeatTimes: 3,
      },
      timer: { isHidden: true },
      quote: { position: "bottom-left", isHidden: true },
      background: "/backgrounds/focus.webp",
    },
    {
      name: "Relax",
      icon: <Relax color="currentColor" />,
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      pomodoro: {
        isHidden: true,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStart: false,
        alarmSound: true,
        alarmSoundURL: DEFAULT_ALARM_SOUND,
        alarmRepeatTimes: 3,
      },
      timer: { isHidden: true },
      quote: { position: "top-right", isHidden: false },
      background: "/backgrounds/relax.webp",
    },
  ],
  selectedTab: "",
  selectTab: () => {},
  updateSpaceProperty: () => {},
  updateSpaceSharedProperty: () => {},
  playPomodoroAlarm: async () => {},
  stopPomodoroAlarm: () => {},
  isAlarmPlaying: false,
};

const SpacesContext = createContext<SpaceContextValue>(initialState);

export function SpacesProvider({ children }: { children: React.ReactNode }) {
  const [selectedTab, setSelectedTab] = useState("Focus");
  const [spaces, setSpaces] = useState<Space[]>(initialState.spaces);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playCountRef = useRef(0);

  function selectTab(tab: string) {
    setSelectedTab(tab);
  }

  function updateSpaceProperty(
    spaceName: string,
    propertyName: keyof Space,
    value: any,
  ) {
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) =>
        space.name === spaceName ? { ...space, [propertyName]: value } : space,
      ),
    );
  }

  function updateSpaceSharedProperty(propertyName: "isHidden", value: boolean) {
    setSpaces((prevSpaces) =>
      prevSpaces.map((space) => ({
        ...space,
        [propertyName]: value,
      })),
    );
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
  };

  return (
    <SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>
  );
}

export const useSpacesContext = () => useContext(SpacesContext);
