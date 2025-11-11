import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { db } from "@/server/db";
import { logger } from "@/utils/logger";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, text, type } = await req.json();

    if (!id || text === undefined || text === null || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const settings = await db.settings.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        _count: { select: { reminders: true } },
      },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found" },
        { status: 404 },
      );
    }

    if (settings._count.reminders >= 10) {
      return NextResponse.json(
        { error: "Reminder limit exceeded. Maximum 10 reminders allowed." },
        { status: 400 },
      );
    }

    await db.$transaction([
      db.reminder.create({
        data: {
          id,
          message: text,
          type,
          settingsId: settings.id,
        },
      }),
      db.settings.update({
        where: { id: settings.id },
        data: { lastModified: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Reminder already exists" },
        { status: 409 },
      );
    }
    logger.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, text, type } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing reminder ID" },
        { status: 400 },
      );
    }

    const reminder = await db.reminder.findFirst({
      where: {
        id,
        settings: { userId: session.user.id },
      },
    });

    if (!reminder) {
      return NextResponse.json(
        { error: "Reminder not found" },
        { status: 404 },
      );
    }

    const updateData: { message?: string; type?: string } = {};
    if (text !== undefined) updateData.message = text;
    if (type !== undefined) updateData.type = type;

    await db.$transaction([
      db.reminder.update({
        where: { id },
        data: updateData,
      }),
      db.settings.update({
        where: { userId: session.user.id },
        data: { lastModified: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating reminder:", error);
    return NextResponse.json(
      { error: "Failed to update reminder" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing reminder ID" },
        { status: 400 },
      );
    }

    const reminder = await db.reminder.findFirst({
      where: {
        id,
        settings: { userId: session.user.id },
      },
    });

    if (!reminder) {
      return NextResponse.json(
        { error: "Reminder not found" },
        { status: 404 },
      );
    }

    await db.$transaction([
      db.reminder.delete({
        where: { id },
      }),
      db.settings.update({
        where: { userId: session.user.id },
        data: { lastModified: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error deleting reminder:", error);
    return NextResponse.json(
      { error: "Failed to delete reminder" },
      { status: 500 },
    );
  }
}
