import { NextResponse } from "next/server";
import type { Change, ChangeType } from "@/types/changes";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { db } from "@/server/db";

export async function POST(req: Request) {
  try {
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

    const groupedChanges = changes.reduce(
      (acc: Record<ChangeType, Change[]>, change: Change) => {
        if (!acc[change.type]) acc[change.type] = [];
        acc[change.type].push(change);
        return acc;
      },
      {} as Record<ChangeType, Change[]>,
    );

    const processedChangeIds = await db.$transaction(async (tx) => {
      const processedIds: string[] = [];

      if (groupedChanges.space) {
        const settings = await tx.settings.findUnique({
          where: { userId: session.user.id },
          select: {
            id: true,
            spaces: { select: { id: true, clientId: true } },
          }, // Added id to select
        });

        if (!settings) throw new Error("Settings not found");

        await Promise.all(
          groupedChanges.space.map(async (change: Change) => {
            const space = settings.spaces.find(
              (s) => s.clientId === change.spaceId,
            );
            if (!space) throw new Error(`Space not found: ${change.spaceId}`);

            const updateData = createSpaceUpdateData(change);
            await tx.space.update({
              where: { id: space.id },
              data: updateData,
            });

            await tx.settings.update({
              where: { id: settings.id },
              data: { lastModified: new Date() },
            });

            processedIds.push(change.id);
          }),
        );
      }

      // Handle reminder changes in batch
      if (groupedChanges.reminder) {
        // First, get the settings ID which we'll need for creating new reminders
        const settings = await tx.settings.findUnique({
          where: { userId: session.user.id },
          select: { id: true },
        });

        if (!settings) {
          throw new Error("Settings not found");
        }

        // Process each reminder change
        await Promise.all(
          groupedChanges.reminder.map(async (change: Change) => {
            const { action, value } = change;

            switch (action) {
              case "create": {
                // Type assertion for create operation
                const createValue = value as {
                  id: string;
                  text: string;
                  type: string;
                };

                await tx.reminder.create({
                  data: {
                    id: createValue.id, // Use the client-provided ID
                    message: createValue.text,
                    type: createValue.type,
                    settingsId: settings.id,
                  },
                });
                break;
              }

              case "update": {
                // First verify the reminder exists and belongs to the user
                const existingReminder = await tx.reminder.findFirst({
                  where: {
                    id: (value as { id: string }).id,
                    settings: {
                      userId: session.user.id,
                    },
                  },
                });

                if (!existingReminder) {
                  throw new Error(
                    `Reminder not found or unauthorized: ${(value as { id: string }).id}`,
                  );
                }

                // Type assertion for update operation
                const updateValue = value as {
                  id: string;
                  text?: string;
                  type?: string;
                };

                // Build update data based on what was provided
                const updateData: {
                  message?: string;
                  type?: string;
                } = {};

                if (updateValue.text !== undefined) {
                  updateData.message = updateValue.text;
                }
                if (updateValue.type !== undefined) {
                  updateData.type = updateValue.type;
                }

                await tx.reminder.update({
                  where: { id: updateValue.id },
                  data: updateData,
                });
                break;
              }

              case "delete": {
                // First verify the reminder exists and belongs to the user
                const existingReminder = await tx.reminder.findFirst({
                  where: {
                    id: (value as { id: string }).id,
                    settings: {
                      userId: session.user.id,
                    },
                  },
                });

                if (!existingReminder) {
                  throw new Error(
                    `Reminder not found or unauthorized: ${(value as { id: string }).id}`,
                  );
                }

                await tx.reminder.delete({
                  where: { id: (value as { id: string }).id },
                });
                break;
              }

              default:
                throw new Error(`Invalid reminder action: ${action}`);
            }
          }),
        );

        processedIds.push(
          ...groupedChanges.reminder.map((change: Change) => change.id),
        );
      }

      // Handle shortcut changes
      if (groupedChanges.shortcut) {
        await tx.settings.update({
          where: { userId: session.user.id },
          data: { shortcut: groupedChanges.shortcut[0].value as string },
        });
        processedIds.push(
          ...groupedChanges.shortcut.map((change: Change) => change.id),
        );
      }

      // Handle ambient sound changes
      if (groupedChanges.ambientSound) {
        await tx.settings.update({
          where: { userId: session.user.id },
          data: {
            ambientSound: groupedChanges.ambientSound[0].value as string,
          },
        });
        processedIds.push(
          ...groupedChanges.ambientSound.map((change: Change) => change.id),
        );
      }

      return processedIds;
    });

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

function createSpaceUpdateData(change: Change) {
  const { property, value } = change;

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
        [property!]: value,
      };
  }
}
