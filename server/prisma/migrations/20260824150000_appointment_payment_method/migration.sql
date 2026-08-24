-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'CHAMBER';

-- CreateEnum
CREATE TYPE "AppointmentPaymentMethod" AS ENUM ('CASH', 'SSL', 'BKASH');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "paymentMethod" "AppointmentPaymentMethod";
ALTER TABLE "Appointment" ADD COLUMN "collectedAmount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "PaymentSetting" (
    "id" TEXT NOT NULL,
    "isSingleton" BOOLEAN NOT NULL DEFAULT true,
    "bkashMerchantQrUrl" TEXT,
    "bkashMerchantQrPublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSetting_isSingleton_key" ON "PaymentSetting"("isSingleton");

-- CreateIndex
CREATE INDEX "Payment_appointmentId_idx" ON "Payment"("appointmentId");

-- Drop orphan payment appointment references before adding the FK
UPDATE "Payment"
SET "appointmentId" = NULL
WHERE "appointmentId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "Appointment" AS a WHERE a."id" = "Payment"."appointmentId"
  );

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
