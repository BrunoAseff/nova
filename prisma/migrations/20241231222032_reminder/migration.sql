/*
  Warnings:

  - You are about to drop the column `position` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "position",
ADD COLUMN     "type" TEXT;
