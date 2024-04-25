/*
  Warnings:

  - You are about to drop the column `friends` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pendingRequest` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "friends",
DROP COLUMN "pendingRequest";

-- CreateTable
CREATE TABLE "_Userfreinds" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Userfreinds_AB_unique" ON "_Userfreinds"("A", "B");

-- CreateIndex
CREATE INDEX "_Userfreinds_B_index" ON "_Userfreinds"("B");

-- AddForeignKey
ALTER TABLE "_Userfreinds" ADD CONSTRAINT "_Userfreinds_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Userfreinds" ADD CONSTRAINT "_Userfreinds_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
