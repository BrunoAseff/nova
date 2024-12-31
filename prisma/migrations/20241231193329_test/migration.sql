/*
  Warnings:

  - You are about to drop the column `ambientSoundVolume` on the `Settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "ambientSoundVolume";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dataMigrated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");
