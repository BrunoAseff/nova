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
  console.log("Handling space change:", { userId, spaceId, property, value });

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

  if (property === "pomodoro") {
    // Map the nested pomodoro object to the flat database structure
    const pomodoroValue = value as {
      isHidden: boolean;
      shortBreakDuration: number;
      longBreakDuration: number;
      autoStart: boolean;
      alarmSound: boolean;
      alarmSoundURL: string;
      alarmRepeatTimes: number;
    };

    await prisma.space.update({
      where: { id: space.id },
      data: {
        pomodoroIsHidden: pomodoroValue.isHidden,
        shortBreakDuration: pomodoroValue.shortBreakDuration,
        longBreakDuration: pomodoroValue.longBreakDuration,
        pomodoroAutoStart: pomodoroValue.autoStart,
        alarmSound: pomodoroValue.alarmSound,
        alarmSoundURL: pomodoroValue.alarmSoundURL,
        alarmRepeatTimes: pomodoroValue.alarmRepeatTimes,
      },
    });
  } else {
    await prisma.space.update({
      where: { id: space.id },
      data: {
        [property!]: value,
      },
    });
  }
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
    case "create":
      await prisma.reminder.create({
        data: {
          settingsId: settings.id,
          message: (value as { text: string }).text,
          type: (value as { type?: string }).type,
        },
      });
      break;

    case "update":
      const updateData = value as { id: string; text?: string; type?: string };
      await prisma.reminder.update({
        where: { id: updateData.id },
        data: {
          ...(updateData.text && { message: updateData.text }),
          ...(updateData.type && { type: updateData.type }),
        },
      });
      break;

    case "delete":
      await prisma.reminder.delete({
        where: { id: (value as { id: string }).id },
      });
      break;
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
