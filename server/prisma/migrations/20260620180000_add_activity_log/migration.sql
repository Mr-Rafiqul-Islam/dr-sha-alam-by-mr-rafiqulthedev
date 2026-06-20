-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('APPOINTMENT_STATUS_CHANGED', 'APPOINTMENT_DELETED', 'CONTACT_MESSAGE_STATUS_CHANGED', 'CONTACT_MESSAGE_DELETED', 'BLOG_CREATED', 'BLOG_UPDATED', 'BLOG_DELETED', 'BLOG_FEATURED_CHANGED', 'SCHEDULE_CREATED', 'SCHEDULE_UPDATED', 'SCHEDULE_DELETED', 'SLOT_DEFAULTS_UPDATED');

-- CreateEnum
CREATE TYPE "ActivityEntityType" AS ENUM ('Appointment', 'ContactMessage', 'Blog', 'AppointmentSchedule', 'AppointmentSlotDefaultConfig');

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorRole" "UserRole" NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "entityType" "ActivityEntityType" NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_actorId_createdAt_idx" ON "ActivityLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
