"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DEFAULT_VALUES = {
  shortcut: "ambientSound",
  ambientSound:
    "https://utfs.io/f/C3k2e5UQDa972ez8jJ7CdSL1HsIwEuK4TvJXprUencqoxa8W",
  reminderMessages: [],
  spaces: [
    {
      name: "Home",
      clock: { isHidden: false, position: "center", timeFormat: "24h" },
      pomodoro: {
        isHidden: true,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStart: false,
        alarmSound: true,
        alarmSoundURL: "/alarm-sounds/calming-alarm.wav",
        alarmRepeatTimes: 3,
      },
      breathingExercise: { isHidden: true, technique: "Box Breathing" },
      reminder: { isHidden: true, position: "top-right" },
      quote: { position: "bottom-left", isHidden: false },
      background:
        "https://utfs.io/f/C3k2e5UQDa979nPTYgc69pKfgXcSlCYx1ADa82uERWQ3BFUM",
    },
    {
      name: "Focus",
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      pomodoro: {
        isHidden: false,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStart: false,
        alarmSound: true,
        alarmSoundURL: "/alarm-sounds/calming-alarm.wav",
        alarmRepeatTimes: 3,
      },
      breathingExercise: { isHidden: true, technique: "Box Breathing" },
      reminder: { isHidden: true, position: "top-right" },
      quote: { position: "bottom-left", isHidden: true },
      background:
        "https://utfs.io/f/C3k2e5UQDa9715lJJA3des8fHYobiMNpx0Z25hGRuCJ9ngSL",
    },
    {
      name: "Relax",
      clock: { isHidden: true, position: "top-right", timeFormat: "24h" },
      pomodoro: {
        isHidden: true,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStart: false,
        alarmSound: true,
        alarmSoundURL: "/alarm-sounds/calming-alarm.wav",
        alarmRepeatTimes: 3,
      },
      breathingExercise: { isHidden: false, technique: "Box Breathing" },
      reminder: { isHidden: true, position: "top-left" },
      quote: { position: "top-right", isHidden: false },
      background:
        "https://utfs.io/f/C3k2e5UQDa97QJVFrk5feZREi0MsQ2bqLCGygxKtDAOzkHFp",
    },
  ],
};

export const migrateLocalStorageToDatabase = async (
  userId: string,
  localData: any,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dataMigrated: true },
    });

    if (user?.dataMigrated) {
      console.log("Data has already been migrated for this user.");
      return;
    }

    // Merge local data with defaults
    const spaces = localData.spaces || DEFAULT_VALUES.spaces;
    const shortcut = localData.shortcut || DEFAULT_VALUES.shortcut;
    const ambientSound = localData.ambientSound || DEFAULT_VALUES.ambientSound;
    const reminderMessages =
      localData.reminderMessages || DEFAULT_VALUES.reminderMessages;

    // Create or update settings for the user
    const settings = await prisma.settings.upsert({
      where: { userId },
      update: {
        shortcut,
        ambientSound,
        isAmbientSoundPlaying: false, // Using schema default
      },
      create: {
        userId,
        shortcut,
        ambientSound,
        isAmbientSoundPlaying: false, // Using schema default
      },
    });

    // For spaces, first check if this settings ID already has any spaces
    const existingSpaces = await prisma.space.findMany({
      where: { settingsId: settings.id },
    });

    // If no existing spaces, create new ones
    if (existingSpaces.length === 0) {
      for (const space of spaces) {
        await prisma.space.create({
          data: {
            settingsId: settings.id,
            name: space.name,
            clockIsHidden: space.clock.isHidden,
            clockPosition: space.clock.position,
            clockTimeFormat: space.clock.timeFormat,
            pomodoroIsHidden: space.pomodoro.isHidden,
            shortBreakDuration: space.pomodoro.shortBreakDuration,
            longBreakDuration: space.pomodoro.longBreakDuration,
            pomodoroAutoStart: space.pomodoro.autoStart,
            alarmSound: space.pomodoro.alarmSound,
            alarmSoundURL: space.pomodoro.alarmSoundURL,
            alarmRepeatTimes: space.pomodoro.alarmRepeatTimes,
            breathingIsHidden: space.breathingExercise.isHidden,
            breathingTechnique: space.breathingExercise.technique,
            reminderIsHidden: space.reminder.isHidden,
            reminderPosition: space.reminder.position,
            quoteIsHidden: space.quote.isHidden,
            quotePosition: space.quote.position,
            background: space.background,
          },
        });
      }
    }

    // Handle reminders
    if (reminderMessages.length > 0) {
      for (const reminder of reminderMessages) {
        await prisma.reminder.create({
          data: {
            message: reminder.text,
            type: reminder.type,
            settingsId: settings.id,
          },
        });
      }
    }

    // Update the user to mark data as migrated
    await prisma.user.update({
      where: { id: userId },
      data: { dataMigrated: true },
    });

    console.log("Data successfully migrated to the database.");
  } catch (error) {
    console.error("Error during data migration:", error);
    throw error;
  }
};
