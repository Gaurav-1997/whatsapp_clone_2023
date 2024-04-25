/*
  Warnings:

  - You are about to drop the `_Userfreinds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Userfreinds" DROP CONSTRAINT "_Userfreinds_A_fkey";

-- DropForeignKey
ALTER TABLE "_Userfreinds" DROP CONSTRAINT "_Userfreinds_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friend_id" INTEGER,
ADD COLUMN     "pending_id" INTEGER;

-- DropTable
DROP TABLE "_Userfreinds";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pending_id_fkey" FOREIGN KEY ("pending_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
