-- AlterTable
ALTER TABLE "Shot" ADD COLUMN     "coffee" JSONB,
ADD COLUMN     "commentsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" JSONB,
ADD COLUMN     "recipe" JSONB;
