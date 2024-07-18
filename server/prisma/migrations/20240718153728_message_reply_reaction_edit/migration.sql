/*
  Warnings:

  - You are about to drop the column `reactedBy` on the `MessageReaction` table. All the data in the column will be lost.
  - Added the required column `reactedByUserName` to the `MessageReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessageReaction" DROP COLUMN "reactedBy",
ADD COLUMN     "reactedByUserName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "editedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
