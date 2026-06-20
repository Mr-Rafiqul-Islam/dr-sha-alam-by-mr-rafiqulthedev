-- CreateEnum
CREATE TYPE "AppointmentPaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'CANCEL');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "paymentStatus" "AppointmentPaymentStatus";
