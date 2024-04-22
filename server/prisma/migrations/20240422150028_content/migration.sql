/*
  Warnings:

  - You are about to drop the column `message` on the `Messages` table. All the data in the column will be lost.
  - The `messageStatus` column on the `Messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `content` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageDeliveryStatus" AS ENUM ('SENT', 'SEEN', 'READ');

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "message",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "seen_by" INTEGER[],
DROP COLUMN "messageStatus",
ADD COLUMN     "messageStatus" "MessageDeliveryStatus" NOT NULL DEFAULT 'SENT';

-- DropEnum
DROP TYPE "MessageDeliveryStaus";
