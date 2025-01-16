"use server";

import { db } from "../db";

/**
 * Deletes a user account and all related data.
 * This includes:
 * - Account (OAuth data)
 * - Sessions
 * - Settings
 *   - Spaces
 *   - Reminders
 * - User record
 * @param userId - The ID of the user to delete.
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  try {
    await db.$transaction(async (tx) => {
      // First get the settings ID for this user
      const userSettings = await tx.settings.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (userSettings) {
        // Delete all spaces associated with the user's settings
        await tx.space.deleteMany({
          where: { settingsId: userSettings.id },
        });

        // Delete all reminders associated with the user's settings
        await tx.reminder.deleteMany({
          where: { settingsId: userSettings.id },
        });
      }

      // Delete the settings record itself
      await tx.settings.deleteMany({
        where: { userId },
      });

      // Delete OAuth accounts
      await tx.account.deleteMany({
        where: { userId },
      });

      // Delete sessions
      await tx.session.deleteMany({
        where: { userId },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    console.log(
      `User with ID ${userId} and all related data were deleted successfully.`,
    );
  } catch (error) {
    console.error(`Failed to delete user account with ID ${userId}:`, error);
    throw new Error("Failed to delete user account and related data.");
  }
}

/**
 * Changes the username of a user.
 * @param userId - The ID of the user to update.
 * @param newUsername - The new username to set.
 */
export async function changeUsername(
  userId: string,
  newUsername: string,
): Promise<void> {
  try {
    await db.user.update({
      where: { id: userId },
      data: { name: newUsername },
    });
    console.log(
      `Username for user with ID ${userId} was updated to ${newUsername}.`,
    );
  } catch (error) {
    console.error(
      `Failed to update username for user with ID ${userId}:`,
      error,
    );
    throw new Error("Failed to update username.");
  }
}
