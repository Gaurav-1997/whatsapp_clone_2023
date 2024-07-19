-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "messagesId" TEXT,
ADD COLUMN     "pinnedMessage" TEXT,
ADD COLUMN     "pinnedMessageId" TEXT;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "parentMessageContent" TEXT;
