import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveLocalDataToDatabase = async (
  localData: any,
  userId: string,
) => {
  try {
    const {
      spaces,
      shortcut,
      ambientSound,

      reminderMessages,
    } = localData;

    // Handle user settings
    const settings = await prisma.settings.upsert({
      where: { userId },
      update: {
        shortcut,
        ambientSound,
      },
      create: {
        userId,
        shortcut,
        ambientSound,
      },
    });

    // Handle spaces
    for (const space of spaces) {
      await prisma.space.upsert({
        where: { id: space.id || "" },
        update: {
          name: space.name,
          clockIsHidden: space.clockIsHidden,
          clockPosition: space.clockPosition,
          clockTimeFormat: space.clockTimeFormat,
          pomodoroIsHidden: space.pomodoroIsHidden,
          shortBreakDuration: space.shortBreakDuration,
          longBreakDuration: space.longBreakDuration,
          pomodoroAutoStart: space.pomodoroAutoStart,
          alarmSound: space.alarmSound,
          alarmSoundURL: space.alarmSoundURL,
          alarmRepeatTimes: space.alarmRepeatTimes,
          breathingIsHidden: space.breathingIsHidden,
          breathingTechnique: space.breathingTechnique,
          reminderIsHidden: space.reminderIsHidden,
          reminderPosition: space.reminderPosition,
          quoteIsHidden: space.quoteIsHidden,
          quotePosition: space.quotePosition,
          background: space.background,
          settingsId: settings.id,
        },
        create: {
          id: space.id || undefined, // Optional, Prisma will generate ID
          settingsId: settings.id,
          name: space.name,
          clockIsHidden: space.clockIsHidden,
          clockPosition: space.clockPosition,
          clockTimeFormat: space.clockTimeFormat,
          pomodoroIsHidden: space.pomodoroIsHidden,
          shortBreakDuration: space.shortBreakDuration,
          longBreakDuration: space.longBreakDuration,
          pomodoroAutoStart: space.pomodoroAutoStart,
          alarmSound: space.alarmSound,
          alarmSoundURL: space.alarmSoundURL,
          alarmRepeatTimes: space.alarmRepeatTimes,
          breathingIsHidden: space.breathingIsHidden,
          breathingTechnique: space.breathingTechnique,
          reminderIsHidden: space.reminderIsHidden,
          reminderPosition: space.reminderPosition,
          quoteIsHidden: space.quoteIsHidden,
          quotePosition: space.quotePosition,
          background: space.background,
        },
      });
    }

    // Handle reminders
    for (const reminder of reminderMessages) {
      await prisma.reminder.upsert({
        where: { id: reminder.id || "" },
        update: {
          message: reminder.message,
          position: reminder.position,
          settingsId: settings.id,
        },
        create: {
          id: reminder.id || undefined,
          message: reminder.message,
          position: reminder.position,
          settingsId: settings.id,
        },
      });
    }

    console.log("Data successfully saved to the database.");
  } catch (error) {
    console.error("Error saving data to database:", error);
  }
};
