-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_chatId_fkey";

-- DropIndex
DROP INDEX "Messages_chatId_key";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "last_message" TEXT;

-- AlterTable
ALTER TABLE "Messages" ALTER COLUMN "chatId" DROP NOT NULL,
ALTER COLUMN "chatId" DROP DEFAULT;
