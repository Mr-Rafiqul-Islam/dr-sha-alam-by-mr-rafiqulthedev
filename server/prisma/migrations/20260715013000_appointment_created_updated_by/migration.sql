-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "createdById" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "updatedById" TEXT;

-- CreateIndex
CREATE INDEX "Appointment_createdById_idx" ON "Appointment"("createdById");
CREATE INDEX "Appointment_updatedById_idx" ON "Appointment"("updatedById");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
