/*
  Warnings:

  - You are about to drop the column `sender_id` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `groupParticipant_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `GroupParticipant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[admin_email]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[last_message_sender_id]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupParticipant" DROP CONSTRAINT "GroupParticipant_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupParticipant_id_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "sender_id",
ADD COLUMN     "admin_email" TEXT,
ADD COLUMN     "group_chat_name" TEXT,
ADD COLUMN     "last_message_sender_id" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groupParticipant_id";

-- DropTable
DROP TABLE "GroupParticipant";

-- CreateTable
CREATE TABLE "_chatUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_chatUser_AB_unique" ON "_chatUser"("A", "B");

-- CreateIndex
CREATE INDEX "_chatUser_B_index" ON "_chatUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_admin_email_key" ON "Chat"("admin_email");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_last_message_sender_id_key" ON "Chat"("last_message_sender_id");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_last_message_sender_id_fkey" FOREIGN KEY ("last_message_sender_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatUser" ADD CONSTRAINT "_chatUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("chat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatUser" ADD CONSTRAINT "_chatUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
