-- CreateEnum
CREATE TYPE "MaintainabilityRating" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL');

-- AlterTable
ALTER TABLE "reviews"
  ADD COLUMN "maintainabilityRating" "MaintainabilityRating",
  ADD COLUMN "metricsJson" JSONB;
