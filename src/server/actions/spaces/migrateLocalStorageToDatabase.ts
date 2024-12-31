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

    for (const space of spaces) {
      await prisma.space.upsert({
        where: { id: space.id?.toString() || "" },
        update: {
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
        create: {
          id: space.id?.toString() || undefined,
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

    for (const reminder of reminderMessages) {
      await prisma.reminder.upsert({
        where: { id: reminder.id?.toString() || "" },
        update: {
          message: reminder.text,
          position: reminder.type,
          settingsId: settings.id,
        },
        create: {
          id: reminder.id?.toString() || undefined,
          message: reminder.text,
          position: reminder.type,
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
  }
};
