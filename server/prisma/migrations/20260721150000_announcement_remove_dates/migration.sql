-- DropIndex
DROP INDEX IF EXISTS "Announcement_status_startDate_endDate_idx";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN IF EXISTS "startDate";
ALTER TABLE "Announcement" DROP COLUMN IF EXISTS "endDate";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Announcement_status_idx" ON "Announcement"("status");
