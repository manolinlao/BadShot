-- Replace the participant join table with two direct user references.
DROP TABLE "ConversationParticipant";

ALTER TABLE "Conversation"
  ADD COLUMN "userOneId" TEXT NOT NULL,
  ADD COLUMN "userTwoId" TEXT NOT NULL;

CREATE UNIQUE INDEX "Conversation_userOneId_userTwoId_key"
  ON "Conversation"("userOneId", "userTwoId");

CREATE INDEX "Conversation_userOneId_idx"
  ON "Conversation"("userOneId");

CREATE INDEX "Conversation_userTwoId_idx"
  ON "Conversation"("userTwoId");

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_userOneId_fkey"
  FOREIGN KEY ("userOneId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation"
  ADD CONSTRAINT "Conversation_userTwoId_fkey"
  FOREIGN KEY ("userTwoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
