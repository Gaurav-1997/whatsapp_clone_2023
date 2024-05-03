/*
  Warnings:

  - You are about to drop the column `latest_message` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `latest_message_sender` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "latest_message",
DROP COLUMN "latest_message_sender";
