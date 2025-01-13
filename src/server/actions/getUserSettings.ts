"use server";
import { PrismaClient } from "@prisma/client";
import { settings as defaultSettings } from "@/contexts/settings";

const prisma = new PrismaClient();

export async function getUserSettings(userId: string) {
  const dbSettings = await prisma.settings.findUnique({
    where: { userId },
    include: {
      spaces: true,
      reminders: true,
    },
  });

  // Transform and return only the data that exists in the database
  const settings: any = {};

  if (
    dbSettings &&
    Array.isArray(dbSettings.spaces) &&
    dbSettings.spaces.length > 0
  ) {
    settings.spaces = dbSettings.spaces.map((space) => {
      // Find the corresponding default space to get the icon
      const defaultSpace = defaultSettings.spaces.find(
        (s) => s.id === space.clientId,
      );

      if (!defaultSpace) {
        console.warn(`No default space found for ID ${space.clientId}`);
        return {
          id: space.clientId,
          name: space.name,
          clock: {
            isHidden: space.clockIsHidden,
            position: space.clockPosition ?? undefined,
            timeFormat: space.clockTimeFormat ?? undefined,
          },
          pomodoro: {
            isHidden: space.pomodoroIsHidden,
            shortBreakDuration: space.shortBreakDuration,
            longBreakDuration: space.longBreakDuration,
            autoStart: space.pomodoroAutoStart,
            alarmSound: space.alarmSound,
            alarmSoundURL: space.alarmSoundURL ?? undefined,
            alarmRepeatTimes: space.alarmRepeatTimes,
          },
          breathingExercise: {
            isHidden: space.breathingIsHidden,
            technique: space.breathingTechnique ?? undefined,
          },
          reminder: {
            isHidden: space.reminderIsHidden,
            position: space.reminderPosition ?? undefined,
          },
          quote: {
            position: space.quotePosition ?? undefined,
            isHidden: space.quoteIsHidden,
          },
          background: space.background ?? undefined,
          icon: defaultSettings.spaces[0]!.icon, // Fallback to first default space icon
        };
      }

      return {
        id: space.clientId,
        name: space.name,
        clock: {
          isHidden: space.clockIsHidden,
          position: space.clockPosition ?? undefined,
          timeFormat: space.clockTimeFormat ?? undefined,
        },
        pomodoro: {
          isHidden: space.pomodoroIsHidden,
          shortBreakDuration: space.shortBreakDuration,
          longBreakDuration: space.longBreakDuration,
          autoStart: space.pomodoroAutoStart,
          alarmSound: space.alarmSound,
          alarmSoundURL: space.alarmSoundURL ?? undefined,
          alarmRepeatTimes: space.alarmRepeatTimes,
        },
        breathingExercise: {
          isHidden: space.breathingIsHidden,
          technique: space.breathingTechnique ?? undefined,
        },
        reminder: {
          isHidden: space.reminderIsHidden,
          position: space.reminderPosition ?? undefined,
        },
        quote: {
          position: space.quotePosition ?? undefined,
          isHidden: space.quoteIsHidden,
        },
        background: space.background ?? undefined,
        icon: defaultSpace.icon, // Always use the icon from defaultSettings
      };
    });
  }

  if (dbSettings?.shortcut) {
    settings.shortcut = dbSettings.shortcut;
  }

  if (dbSettings?.ambientSound) {
    settings.ambientSound = dbSettings.ambientSound;
  }

  if (
    dbSettings &&
    Array.isArray(dbSettings.reminders) &&
    dbSettings.reminders.length > 0
  ) {
    settings.reminderMessages = dbSettings.reminders.map((reminder) => ({
      id: reminder.id,
      message: reminder.message,
      type: reminder.type ?? undefined,
    }));
  }

  return settings;
}
