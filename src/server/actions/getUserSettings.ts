"use server";
import { settings as defaultSettings } from "@/contexts/settings";
import { db } from "../db";
import type {
  Space,
  ReminderMessage,
  ShortcutName,
  Position,
  techniqueType,
} from "@/types";

interface UserSettingsReturn {
  spaces?: Space[];
  shortcut?: ShortcutName;
  ambientSound?: string;
  reminderMessages?: ReminderMessage[];
}

export async function getUserSettings(
  userId: string,
): Promise<UserSettingsReturn> {
  const dbSettings = await db.settings.findUnique({
    where: { userId },
    select: {
      shortcut: true,
      ambientSound: true,
      spaces: {
        select: {
          clientId: true,
          name: true,
          clockIsHidden: true,
          clockPosition: true,
          clockTimeFormat: true,
          pomodoroIsHidden: true,
          shortBreakDuration: true,
          longBreakDuration: true,
          pomodoroAutoStart: true,
          alarmSound: true,
          alarmSoundURL: true,
          alarmRepeatTimes: true,
          breathingIsHidden: true,
          breathingTechnique: true,
          reminderIsHidden: true,
          reminderPosition: true,
          quoteIsHidden: true,
          quotePosition: true,
          background: true,
        },
      },
      reminders: {
        select: {
          id: true,
          message: true,
          type: true,
        },
      },
    },
  });

  if (!dbSettings) {
    return {};
  }

  const settings: UserSettingsReturn = {};

  if (Array.isArray(dbSettings.spaces) && dbSettings.spaces.length > 0) {
    settings.spaces = dbSettings.spaces.map((space) => {
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
            position: (space.clockPosition ?? "center") as Position,
            timeFormat: (space.clockTimeFormat ?? "24h") as "24h" | "12h",
          },
          pomodoro: {
            isHidden: space.pomodoroIsHidden,
            shortBreakDuration: space.shortBreakDuration,
            longBreakDuration: space.longBreakDuration,
            autoStart: space.pomodoroAutoStart,
            alarmSound: space.alarmSound,
            alarmSoundURL:
              space.alarmSoundURL ?? "/alarm-sounds/calming-alarm.wav",
            alarmRepeatTimes: space.alarmRepeatTimes,
          },
          breathingExercise: {
            isHidden: space.breathingIsHidden,
            technique: (space.breathingTechnique ??
              "Box Breathing") as techniqueType,
          },
          reminder: {
            isHidden: space.reminderIsHidden,
            position: (space.reminderPosition ?? "top-right") as Position,
          },
          quote: {
            position: (space.quotePosition ?? "bottom-left") as Position,
            isHidden: space.quoteIsHidden,
          },
          background: space.background ?? "",
          icon: defaultSettings.spaces[0]!.icon,
        } as Space;
      }

      return {
        id: space.clientId,
        name: space.name,
        clock: {
          isHidden: space.clockIsHidden,
          position: (space.clockPosition ?? "center") as Position,
          timeFormat: (space.clockTimeFormat ?? "24h") as "24h" | "12h",
        },
        pomodoro: {
          isHidden: space.pomodoroIsHidden,
          shortBreakDuration: space.shortBreakDuration,
          longBreakDuration: space.longBreakDuration,
          autoStart: space.pomodoroAutoStart,
          alarmSound: space.alarmSound,
          alarmSoundURL:
            space.alarmSoundURL ?? "/alarm-sounds/calming-alarm.wav",
          alarmRepeatTimes: space.alarmRepeatTimes,
        },
        breathingExercise: {
          isHidden: space.breathingIsHidden,
          technique: (space.breathingTechnique ??
            "Box Breathing") as techniqueType,
        },
        reminder: {
          isHidden: space.reminderIsHidden,
          position: (space.reminderPosition ?? "top-right") as Position,
        },
        quote: {
          position: (space.quotePosition ?? "bottom-left") as Position,
          isHidden: space.quoteIsHidden,
        },
        background: space.background ?? "",
        icon: defaultSpace.icon,
      } as Space;
    });
  }

  if (dbSettings.shortcut) {
    settings.shortcut = dbSettings.shortcut as ShortcutName;
  }

  if (dbSettings.ambientSound) {
    settings.ambientSound = dbSettings.ambientSound;
  }

  if (Array.isArray(dbSettings.reminders) && dbSettings.reminders.length > 0) {
    settings.reminderMessages = dbSettings.reminders.map((reminder) => ({
      id: reminder.id,
      text: reminder.message,
      type: (reminder.type as ReminderMessage["type"]) ?? "Gratitude",
    }));
  }

  return settings;
}
