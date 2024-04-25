/*
  Warnings:

  - You are about to drop the column `friend_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pending_id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_friend_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pending_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "friend_id",
DROP COLUMN "pending_id",
ADD COLUMN     "friendsId" INTEGER,
ADD COLUMN     "pendingId" INTEGER;

-- CreateTable
CREATE TABLE "Friends" (
    "friend_id" SERIAL NOT NULL,
    "contact_of" INTEGER NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("friend_id")
);

-- CreateTable
CREATE TABLE "PendingRequest" (
    "pending_id" SERIAL NOT NULL,
    "contact_of" INTEGER NOT NULL,

    CONSTRAINT "PendingRequest_pkey" PRIMARY KEY ("pending_id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_friendsId_fkey" FOREIGN KEY ("friendsId") REFERENCES "Friends"("friend_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pendingId_fkey" FOREIGN KEY ("pendingId") REFERENCES "PendingRequest"("pending_id") ON DELETE SET NULL ON UPDATE CASCADE;
