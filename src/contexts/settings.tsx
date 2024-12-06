import { Home } from "@/components/icons/Home";
import { Focus } from "@/components/icons/Focus";
import { Relax } from "@/components/icons/Relax";
import { backgrounds } from "content/backgrounds";
import { ambientSounds } from "content/ambientSounds";
import type { settingsType } from "@/types/settings";

const DEFAULT_ALARM_SOUND = "/alarm-sounds/calming-alarm.wav";

export const settings: settingsType = {
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
      reminder: { isHidden: true, position: "top-right", messages: [] },
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
      reminder: { isHidden: true, position: "top-right", messages: [] },
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
      reminder: { isHidden: true, position: "top-right", messages: [] },
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
