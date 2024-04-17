-- DropIndex
DROP INDEX "User_blockedUsers_key";

-- DropIndex
DROP INDEX "User_friends_key";

-- DropIndex
DROP INDEX "User_pendingRequest_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "User_id_seq";
