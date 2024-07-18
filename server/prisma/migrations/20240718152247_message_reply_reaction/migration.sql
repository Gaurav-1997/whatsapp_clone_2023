-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'LOVE', 'LAUGH', 'SAD', 'ANGRY', 'WOW');

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "parentMessageId" INTEGER,
ADD COLUMN     "repliedByUserName" TEXT;

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL,
    "parentMessageId" TEXT NOT NULL,
    "reactionType" "ReactionType" NOT NULL,
    "reactedBy" TEXT NOT NULL,
    "reactedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "Messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
