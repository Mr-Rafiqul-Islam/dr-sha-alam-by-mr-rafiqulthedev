-- AlterTable
ALTER TABLE "PatientReview" ADD COLUMN "isSuccessStory" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PatientReview" ALTER COLUMN "age" DROP NOT NULL;

-- DropIndex (replaced by composite index including isSuccessStory)
DROP INDEX IF EXISTS "PatientReview_status_sortOrder_idx";

-- CreateIndex
CREATE INDEX "PatientReview_status_isSuccessStory_sortOrder_idx" ON "PatientReview"("status", "isSuccessStory", "sortOrder");
