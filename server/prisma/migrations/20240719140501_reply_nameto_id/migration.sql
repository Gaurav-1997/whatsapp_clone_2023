/*
  Warnings:

  - You are about to drop the column `repliedByUserName` on the `Messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "repliedByUserName",
ADD COLUMN     "repliedByUserId" TEXT;
