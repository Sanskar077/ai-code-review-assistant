-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "reviews"
  ADD COLUMN "analysisStatus" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "analysisError" TEXT;

-- AlterTable
ALTER TABLE "findings" ADD COLUMN "column" INTEGER;
