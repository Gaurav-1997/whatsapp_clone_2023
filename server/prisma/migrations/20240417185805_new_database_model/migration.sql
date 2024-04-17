/*
  Warnings:

  - The primary key for the `Messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `recieverId` on the `Messages` table. All the data in the column will be lost.
  - The `type` column on the `Messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `messageStatus` column on the `Messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[chatId]` on the table `Messages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('PRIVATE', 'GROUP');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'AUDIO');

-- CreateEnum
CREATE TYPE "MessageDeliveryStaus" AS ENUM ('SENT', 'SEEN', 'READ');

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_recieverId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "recieverId",
ADD COLUMN     "chatId" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT',
DROP COLUMN "messageStatus",
ADD COLUMN     "messageStatus" "MessageDeliveryStaus" NOT NULL DEFAULT 'SENT',
ADD CONSTRAINT "Messages_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Messages_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupParticipant_id" INTEGER,
ADD COLUMN     "requestSentTo" INTEGER[],
ADD COLUMN     "status" TEXT DEFAULT '',
ALTER COLUMN "profilePicture" DROP NOT NULL,
ALTER COLUMN "about" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Chat" (
    "chat_id" TEXT NOT NULL,
    "type" "ChatType" NOT NULL DEFAULT 'PRIVATE',
    "sender_id" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "GroupParticipant" (
    "group_id" INTEGER NOT NULL,
    "group_name" TEXT NOT NULL,
    "groupAdmin" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "GroupParticipant_pkey" PRIMARY KEY ("group_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupParticipant_chat_id_key" ON "GroupParticipant"("chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_chatId_key" ON "Messages"("chatId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupParticipant_id_fkey" FOREIGN KEY ("groupParticipant_id") REFERENCES "GroupParticipant"("group_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupParticipant" ADD CONSTRAINT "GroupParticipant_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
