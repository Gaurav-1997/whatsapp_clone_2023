-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_last_message_sender_id_fkey";

-- DropIndex
DROP INDEX "Chat_last_message_sender_id_key";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "last_message_status" "MessageDeliveryStatus" DEFAULT 'SENT';
