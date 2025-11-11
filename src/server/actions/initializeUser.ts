"use server";

import { db } from "@/server/db";

const DEFAULT_ALARM_SOUND = "/alarm-sounds/calming-alarm.wav";

const DEFAULT_SPACES = [
  {
    clientId: 1,
    name: "Home",
    clockIsHidden: false,
    clockPosition: "center",
    clockTimeFormat: "24h",
    pomodoroIsHidden: true,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodoroAutoStart: false,
    alarmSound: true,
    alarmSoundURL: DEFAULT_ALARM_SOUND,
    alarmRepeatTimes: 3,
    breathingIsHidden: true,
    breathingTechnique: "Box Breathing",
    reminderIsHidden: true,
    reminderPosition: "top-right",
    quoteIsHidden: false,
    quotePosition: "bottom-left",
    background:
      "https://utfs.io/f/C3k2e5UQDa979nPTYgc69pKfgXcSlCYx1ADa82uERWQ3BFUM",
  },
  {
    clientId: 2,
    name: "Focus",
    clockIsHidden: true,
    clockPosition: "top-right",
    clockTimeFormat: "24h",
    pomodoroIsHidden: false,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodoroAutoStart: false,
    alarmSound: true,
    alarmSoundURL: DEFAULT_ALARM_SOUND,
    alarmRepeatTimes: 3,
    breathingIsHidden: true,
    breathingTechnique: "Box Breathing",
    reminderIsHidden: true,
    reminderPosition: "top-right",
    quoteIsHidden: true,
    quotePosition: "bottom-left",
    background:
      "https://utfs.io/f/C3k2e5UQDa9715lJJA3des8fHYobiMNpx0Z25hGRuCJ9ngSL",
  },
  {
    clientId: 3,
    name: "Relax",
    clockIsHidden: true,
    clockPosition: "top-right",
    clockTimeFormat: "24h",
    pomodoroIsHidden: true,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    pomodoroAutoStart: false,
    alarmSound: true,
    alarmSoundURL: DEFAULT_ALARM_SOUND,
    alarmRepeatTimes: 3,
    breathingIsHidden: false,
    breathingTechnique: "Box Breathing",
    reminderIsHidden: true,
    reminderPosition: "top-left",
    quoteIsHidden: false,
    quotePosition: "top-right",
    background:
      "https://utfs.io/f/C3k2e5UQDa97QJVFrk5feZREi0MsQ2bqLCGygxKtDAOzkHFp",
  },
];

export async function initializeNewUser(userId: string) {
  try {
    const existingSettings = await db.settings.findUnique({
      where: { userId },
      include: { spaces: true },
    });

    if (existingSettings && existingSettings.spaces.length > 0) {
      return existingSettings;
    }

    const settings = await db.settings.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        shortcut: "ambientSound",
        ambientSound:
          "https://utfs.io/f/C3k2e5UQDa972ez8jJ7CdSL1HsIwEuK4TvJXprUencqoxa8W",
        isAmbientSoundPlaying: false,
        spaces: {
          create: DEFAULT_SPACES,
        },
      },
      include: {
        spaces: true,
      },
    });

    return settings;
  } catch (error) {
    console.error("Error initializing user:", error);
    throw new Error("Failed to initialize user settings");
  }
}
