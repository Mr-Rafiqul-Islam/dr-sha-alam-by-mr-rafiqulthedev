-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "scheduleId" TEXT,
ADD COLUMN     "slotId" TEXT;

-- CreateTable
CREATE TABLE "AppointmentSchedule" (
    "id" TEXT NOT NULL,
    "siteRef" "SiteRef" NOT NULL DEFAULT 'DOCTOR_SHA_ALAM',
    "status" "ScheduleStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentSlot" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "smsLabel" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "seatLimit" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentSchedule_siteRef_date_status_idx" ON "AppointmentSchedule"("siteRef", "date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentSchedule_siteRef_date_key" ON "AppointmentSchedule"("siteRef", "date");

-- CreateIndex
CREATE INDEX "AppointmentSlot_scheduleId_isActive_idx" ON "AppointmentSlot"("scheduleId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentSlot_scheduleId_code_key" ON "AppointmentSlot"("scheduleId", "code");

-- CreateIndex
CREATE INDEX "Appointment_scheduleId_idx" ON "Appointment"("scheduleId");

-- CreateIndex
CREATE INDEX "Appointment_slotId_idx" ON "Appointment"("slotId");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_preferredTime_siteRef_status_idx" ON "Appointment"("appointmentDate", "preferredTime", "siteRef", "status");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "AppointmentSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "AppointmentSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentSlot" ADD CONSTRAINT "AppointmentSlot_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "AppointmentSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
