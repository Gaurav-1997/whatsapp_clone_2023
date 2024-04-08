/*
  Warnings:

  - A unique constraint covering the columns `[blockedUsers]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pendingRequest]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockedUsers" INTEGER[],
ADD COLUMN     "pendingRequest" INTEGER[];

-- CreateIndex
CREATE UNIQUE INDEX "User_blockedUsers_key" ON "User"("blockedUsers");

-- CreateIndex
CREATE UNIQUE INDEX "User_pendingRequest_key" ON "User"("pendingRequest");
