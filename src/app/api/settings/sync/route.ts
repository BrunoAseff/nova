import { NextResponse } from "next/server";
import type { Change } from "@/types/changes";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Get user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { changes } = await req.json();

    if (!changes?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const processedChangeIds: string[] = [];

    // Process each change in sequence
    for (const change of changes) {
      try {
        switch (change.type) {
          case "space":
            await handleSpaceChange(session.user.id, change);
            break;
          case "reminder":
            await handleReminderChange(session.user.id, change);
            break;
          case "shortcut":
            await handleShortcutChange(session.user.id, change);
            break;
          case "ambientSound":
            await handleAmbientSoundChange(session.user.id, change);
            break;
        }
        processedChangeIds.push(change.id);
      } catch (error) {
        console.error("Error details:", error);
        throw error;
      }
    }

    return NextResponse.json({ processedChangeIds });
  } catch (error) {
    console.error("Error in sync route:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

async function handleSpaceChange(userId: string, change: Change) {
  const { spaceId, property, value } = change;

  const settings = await prisma.settings.findUnique({
    where: { userId },
    include: { spaces: true },
  });

  if (!settings) {
    throw new Error("Settings not found");
  }

  const space = settings.spaces.find((s) => s.clientId === spaceId);

  if (!space) {
    throw new Error("Space not found");
  }

  let updateData = {};

  switch (property) {
    case "pomodoro":
      const pomodoroValue = value as {
        isHidden: boolean;
        shortBreakDuration: number;
        longBreakDuration: number;
        autoStart: boolean;
        alarmSound: boolean;
        alarmSoundURL: string;
        alarmRepeatTimes: number;
      };

      updateData = {
        pomodoroIsHidden: pomodoroValue.isHidden,
        shortBreakDuration: pomodoroValue.shortBreakDuration,
        longBreakDuration: pomodoroValue.longBreakDuration,
        pomodoroAutoStart: pomodoroValue.autoStart,
        alarmSound: pomodoroValue.alarmSound,
        alarmSoundURL: pomodoroValue.alarmSoundURL,
        alarmRepeatTimes: pomodoroValue.alarmRepeatTimes,
      };
      break;

    case "clock":
      const clockValue = value as {
        isHidden: boolean;
        position: string;
        timeFormat: string;
      };

      updateData = {
        clockIsHidden: clockValue.isHidden,
        clockPosition: clockValue.position,
        clockTimeFormat: clockValue.timeFormat,
      };
      break;

    case "breathingExercise":
      const breathingValue = value as {
        isHidden: boolean;
        technique: string;
      };

      updateData = {
        breathingIsHidden: breathingValue.isHidden,
        breathingTechnique: breathingValue.technique,
      };
      break;

    case "reminder":
      const reminderValue = value as {
        isHidden: boolean;
        position: string;
      };

      updateData = {
        reminderIsHidden: reminderValue.isHidden,
        reminderPosition: reminderValue.position,
      };
      break;

    case "quote":
      const quoteValue = value as {
        isHidden: boolean;
        position: string;
      };

      updateData = {
        quoteIsHidden: quoteValue.isHidden,
        quotePosition: quoteValue.position,
      };
      break;

    default:
      updateData = {
        [property!]: value,
      };
  }

  console.log("Updating space with data:", updateData);

  await prisma.space.update({
    where: { id: space.id },
    data: updateData,
  });
}

async function handleReminderChange(userId: string, change: Change) {
  const settings = await prisma.settings.findUnique({
    where: { userId },
  });

  if (!settings) {
    throw new Error("Settings not found");
  }

  const { action, value } = change;

  switch (action) {
    case "create": {
      console.log(value);
    }

    case "update": {
      console.log(value);
    }
    case "delete": {
      console.log(value);
    }
  }
}
async function handleShortcutChange(userId: string, change: Change) {
  await prisma.settings.update({
    where: { userId },
    data: { shortcut: change.value as string },
  });
}

async function handleAmbientSoundChange(userId: string, change: Change) {
  await prisma.settings.update({
    where: { userId },
    data: { ambientSound: change.value as string },
  });
}
