/* eslint-disable @typescript-eslint/no-empty-function */

import { Home } from "@/components/icons/Home";
import { Focus } from "@/components/icons/Focus";
import { Relax } from "@/components/icons/Relax";
import { backgrounds } from "content/backgrounds";
import { ambientSounds } from "content/ambientSounds";
import type { ShortcutName, Space } from "@/types";

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
  shortcut: ShortcutName;
  ambientSound: string;
  updateShortcut: (newShortcut: ShortcutName) => void;
  ambientSoundVolume: number;
  isAmbientSoundPlaying: boolean;
  playAmbientSound: (soundUrl?: string) => void;
  pauseAmbientSound: () => void;
  updateAmbientSound: (soundUrl: string) => void;
  updateAmbientSoundVolume: (volume: number) => void;
  toggleAmbientSound: () => void;
  updateLocalStorage: (spaces: Space[]) => void;
  retrieveLocalStorage: () => void;
}

export const initialState: SpaceContextValue = {
  spaces: [
    {
      name: "Home",
      icon: <Home />,
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
      background: backgrounds.find((bg) => bg.name === "River Path")?.url ?? "",
    },
    {
      name: "Focus",
      icon: <Focus />,
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
      background: backgrounds.find((bg) => bg.name === "Messy Desk")?.url ?? "",
    },
    {
      name: "Relax",
      icon: <Relax />,
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
      background:
        backgrounds.find((bg) => bg.name === "Green Field")?.url ?? "",
    },
  ],
  shortcut: "ambientSound",
  ambientSound:
    ambientSounds.find((sound) => sound.name === "Ocean Waves")?.url ?? "",
  selectedTab: "",
  selectTab: () => {},
  updateSpaceProperty: () => {},
  updateSpaceSharedProperty: () => {},
  playPomodoroAlarm: async () => {},
  stopPomodoroAlarm: () => {},
  isAlarmPlaying: false,
  updateShortcut: () => {},
  ambientSoundVolume: 50,
  isAmbientSoundPlaying: false,
  playAmbientSound: () => {},
  pauseAmbientSound: () => {},
  updateAmbientSound: () => {},
  updateAmbientSoundVolume: () => {},
  toggleAmbientSound: () => {},
  updateLocalStorage: () => {},
  retrieveLocalStorage: () => {},
};
