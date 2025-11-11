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

    const { ambientSound } = await req.json();

    if (!ambientSound) {
      return NextResponse.json(
        { error: "Missing ambient sound URL" },
        { status: 400 },
      );
    }

    await db.settings.update({
      where: { userId: session.user.id },
      data: {
        ambientSound,
        lastModified: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error updating ambient sound:", error);
    return NextResponse.json(
      { error: "Failed to update ambient sound" },
      { status: 500 },
    );
  }
}
