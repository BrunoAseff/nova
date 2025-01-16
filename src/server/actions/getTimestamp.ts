"use server";

import { db } from "../db";

/**
 * Gets the lastModified timestamp for a user's settings
 * @param userId - The ID of the user
 * @returns The timestamp or null if settings don't exist
 */
export async function getTimestamp(userId: string): Promise<Date | null> {
  try {
    const settings = await db.settings.findUnique({
      where: { userId },
      select: { lastModified: true },
    });

    return settings?.lastModified ?? null;
  } catch (error) {
    console.error("Error fetching timestamp:", error);
    throw new Error("Failed to fetch timestamp");
  }
}
