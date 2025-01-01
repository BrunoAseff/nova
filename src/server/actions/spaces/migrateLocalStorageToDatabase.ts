"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

    const { spaces, shortcut, ambientSound, reminderMessages } = localData;

    // Create or update settings for the user
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
    for (const reminder of reminderMessages) {
      await prisma.reminder.create({
        data: {
          message: reminder.text,
          type: reminder.type,
          settingsId: settings.id,
        },
      });
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
