"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Deletes a user account and all related data.
 * This handles both OAuth users (Account table) and credentials-based users (User table).
 * @param userId - The ID of the user to delete.
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete related records in cascade
      await tx.account.deleteMany({
        where: { userId },
      });
      await tx.session.deleteMany({
        where: { userId },
      });
      await tx.settings.deleteMany({
        where: { userId },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });
    console.log(
      `User with ID ${userId} and related data were deleted successfully.`,
    );
  } catch (error) {
    console.error(`Failed to delete user account with ID ${userId}:`, error);
    throw new Error("Failed to delete user account.");
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
    await prisma.user.update({
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
