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
    console.log("Received changes:", changes);

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

      if (groupedChanges.reminder) {
        const settings = await tx.settings.findUnique({
          where: { userId: session.user.id },
          select: { id: true },
        });

        if (!settings) {
          throw new Error("Settings not found");
        }

        const sortedChanges = [...groupedChanges.reminder].sort(
          (a, b) => a.timestamp - b.timestamp,
        );

        for (const change of sortedChanges) {
          const { action, value } = change;

          try {
            switch (action) {
              case "create": {
                const createValue = value as {
                  id: string;
                  text: string;
                  type: string;
                };

                await tx.reminder.create({
                  data: {
                    id: createValue.id,
                    message: createValue.text,
                    type: createValue.type,
                    settingsId: settings.id,
                  },
                });
                break;
              }

              case "update": {
                const updateValue = value as {
                  id: string;
                  text?: string;
                  type?: string;
                };

                const existingReminder = await tx.reminder.findFirst({
                  where: {
                    id: updateValue.id,
                    settings: {
                      userId: session.user.id,
                    },
                  },
                });

                if (!existingReminder) {
                  console.log(
                    `Skipping update for non-existent reminder: ${updateValue.id}`,
                  );
                  continue;
                }

                const updateData: {
                  message?: string;
                  type?: string;
                } = {};

                if ("text" in updateValue && updateValue.text !== undefined) {
                  updateData.message = updateValue.text;
                }
                if ("type" in updateValue && updateValue.type !== undefined) {
                  updateData.type = updateValue.type;
                }

                if (Object.keys(updateData).length > 0) {
                  await tx.reminder.update({
                    where: { id: updateValue.id },
                    data: updateData,
                  });
                }
                break;
              }

              case "delete": {
                const deleteValue = value as { id: string };

                // Check if reminder exists and belongs to user before trying to delete
                const existingReminder = await tx.reminder.findFirst({
                  where: {
                    id: deleteValue.id,
                    settings: {
                      userId: session.user.id,
                    },
                  },
                });

                if (existingReminder) {
                  await tx.reminder.delete({
                    where: { id: deleteValue.id },
                  });
                } else {
                  console.log(
                    `Skipping delete for non-existent reminder: ${deleteValue.id}`,
                  );
                }
                break;
              }
            }
          } catch (error) {
            console.log(`Non-critical error processing reminder change:`, {
              error,
              change,
            });
            continue;
          }
        }

        processedIds.push(
          ...groupedChanges.reminder.map((change: Change) => change.id),
        );
      }
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
    console.error("Error in sync route:", {
      error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        additionalInfo: error instanceof Error ? error.stack : undefined,
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
