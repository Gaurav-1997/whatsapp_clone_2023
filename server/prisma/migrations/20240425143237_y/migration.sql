/*
  Warnings:

  - You are about to drop the column `friendsId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pendingId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Friends` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_friendsId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pendingId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "friendsId",
DROP COLUMN "pendingId";

-- DropTable
DROP TABLE "Friends";

-- DropTable
DROP TABLE "PendingRequest";

-- CreateTable
CREATE TABLE "_friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_pendingRequest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pendingRequest_AB_unique" ON "_pendingRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_pendingRequest_B_index" ON "_pendingRequest"("B");

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pendingRequest" ADD CONSTRAINT "_pendingRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pendingRequest" ADD CONSTRAINT "_pendingRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
