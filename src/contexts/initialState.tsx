import { Home } from "@/components/icons/Home";
import { Focus } from "@/components/icons/Focus";
import { Relax } from "@/components/icons/Relax";
import { backgrounds } from "content/backgrounds";
import type { ShortcutName, Space } from "@/types";
import { ambientSounds } from "content/ambientSounds";

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
  resetSpaces: () => void;
  setSpaces: (spaces: Space[]) => void;
  setShortcut: (shortcut: ShortcutName) => void;
  setAmbientSound: (ambientSound: string) => void;
  setAmbientSoundVolume: (volume: number) => void;
}

export interface userSpace {
  spaces: Space[];
  shortcut: ShortcutName;
  ambientSound: string;
  ambientSoundVolume: number;
  isAmbientSoundPlaying: boolean;
}

export const initialState: userSpace = {
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
      breathingExercise: { isHidden: true, technique: "Box Breathing" },
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
      breathingExercise: { isHidden: true, technique: "Box Breathing" },
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
      breathingExercise: { isHidden: false, technique: "Box Breathing" },
      quote: { position: "top-right", isHidden: false },
      background:
        backgrounds.find((bg) => bg.name === "Green Field")?.url ?? "",
    },
  ],
  shortcut: "ambientSound",
  ambientSound:
    ambientSounds.find((sound) => sound.name === "Ocean Waves")?.url ?? "",
  ambientSoundVolume: 50,
  isAmbientSoundPlaying: false,
};
