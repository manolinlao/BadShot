-- CreateTable
CREATE TABLE "Shot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tastingNotes" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shot" ADD CONSTRAINT "Shot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
