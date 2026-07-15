-- DropIndex
DROP INDEX "reviews_userId_idx";

-- CreateIndex
CREATE INDEX "reviews_userId_createdAt_idx" ON "reviews"("userId", "createdAt");
