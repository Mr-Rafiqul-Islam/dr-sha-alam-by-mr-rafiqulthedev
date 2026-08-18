-- AlterEnum
ALTER TYPE "AppointmentRevenueCategory" ADD VALUE 'OLD_GENERAL';

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "feeCategory" "AppointmentRevenueCategory";

-- CreateIndex
CREATE INDEX "Appointment_feeCategory_idx" ON "Appointment"("feeCategory");
