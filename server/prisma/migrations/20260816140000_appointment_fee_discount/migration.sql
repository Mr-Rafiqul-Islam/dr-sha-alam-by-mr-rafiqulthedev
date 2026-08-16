-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('SPECIAL_DISCOUNT', 'REFUND_DISCOUNT', 'REFERRAL_DISCOUNT', 'SOME_PERCENTAGE_DISCOUNT', 'SOME_FIXED_DISCOUNT');

-- CreateTable
CREATE TABLE "AppointmentFeeDiscount" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "discountAmount" DOUBLE PRECISION,
    "discountType" "DiscountType",
    "discountCode" TEXT,
    "discountPercentage" DOUBLE PRECISION,
    "appointmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentFeeDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentFeeDiscount_appointmentId_idx" ON "AppointmentFeeDiscount"("appointmentId");

-- AddForeignKey
ALTER TABLE "AppointmentFeeDiscount" ADD CONSTRAINT "AppointmentFeeDiscount_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
