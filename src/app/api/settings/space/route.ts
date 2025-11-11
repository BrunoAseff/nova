import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { logger } from "@/utils/logger";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { spaceId, property, value } = await req.json();

    if (!spaceId || !property || value === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const settings = await db.settings.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        spaces: { select: { id: true, clientId: true } },
      },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 },
      );
    }

    const space = settings.spaces.find((s) => s.clientId === spaceId);
    if (!space) {
      return NextResponse.json({ error: "Space not found" }, { status: 404 });
    }

    const updateData = createSpaceUpdateData(property, value);

    await db.$transaction([
      db.space.update({
        where: { id: space.id },
        data: updateData,
      }),
      db.settings.update({
        where: { id: settings.id },
        data: { lastModified: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating space:", error);
    return NextResponse.json(
      { error: "Failed to update space" },
      { status: 500 },
    );
  }
}

function createSpaceUpdateData(property: string, value: any) {
  switch (property) {
    case "pomodoro": {
      const pomodoroValue = value as {
        isHidden: boolean;
        shortBreakDuration: number;
        longBreakDuration: number;
        autoStart: boolean;
        alarmSound: boolean;
        alarmSoundURL: string;
        alarmRepeatTimes: number;
      };
      return {
        pomodoroIsHidden: pomodoroValue.isHidden,
        shortBreakDuration: pomodoroValue.shortBreakDuration,
        longBreakDuration: pomodoroValue.longBreakDuration,
        pomodoroAutoStart: pomodoroValue.autoStart,
        alarmSound: pomodoroValue.alarmSound,
        alarmSoundURL: pomodoroValue.alarmSoundURL,
        alarmRepeatTimes: pomodoroValue.alarmRepeatTimes,
      };
    }

    case "clock": {
      const clockValue = value as {
        isHidden: boolean;
        position: string;
        timeFormat: string;
      };
      return {
        clockIsHidden: clockValue.isHidden,
        clockPosition: clockValue.position,
        clockTimeFormat: clockValue.timeFormat,
      };
    }

    case "breathingExercise": {
      const breathingValue = value as {
        isHidden: boolean;
        technique: string;
      };
      return {
        breathingIsHidden: breathingValue.isHidden,
        breathingTechnique: breathingValue.technique,
      };
    }

    case "reminder": {
      const reminderValue = value as {
        isHidden: boolean;
        position: string;
      };
      return {
        reminderIsHidden: reminderValue.isHidden,
        reminderPosition: reminderValue.position,
      };
    }

    case "quote": {
      const quoteValue = value as {
        isHidden: boolean;
        position: string;
      };
      return {
        quoteIsHidden: quoteValue.isHidden,
        quotePosition: quoteValue.position,
      };
    }

    default:
      return {
        [property]: value,
      };
  }
}
