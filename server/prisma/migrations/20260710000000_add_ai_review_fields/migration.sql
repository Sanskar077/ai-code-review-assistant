-- CreateEnum
CREATE TYPE "AIReviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'SKIPPED');

-- AlterTable
ALTER TABLE "reviews"
  ADD COLUMN "aiReviewStatus" "AIReviewStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "aiReviewError" TEXT,
  ADD COLUMN "aiProvider" TEXT,
  ADD COLUMN "aiModel" TEXT,
  ADD COLUMN "aiProcessingTimeMs" INTEGER,
  ADD COLUMN "aiPromptTokens" INTEGER,
  ADD COLUMN "aiCompletionTokens" INTEGER;

-- AlterTable
ALTER TABLE "findings" ADD COLUMN "source" TEXT;
