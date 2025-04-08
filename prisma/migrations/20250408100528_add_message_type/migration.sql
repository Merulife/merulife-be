-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('CHAT', 'VOICE');

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'CHAT';
