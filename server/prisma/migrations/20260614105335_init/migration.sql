/*
  Warnings:

  - You are about to drop the column `attendTime` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `PatientReview` table. All the data in the column will be lost.
  - You are about to drop the column `isSuccessStory` on the `PatientReview` table. All the data in the column will be lost.
  - You are about to drop the column `problems` on the `PatientReview` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `PatientReview` table. All the data in the column will be lost.
  - You are about to drop the column `treatments` on the `PatientReview` table. All the data in the column will be lost.
  - You are about to drop the column `videoTitle` on the `PatientReview` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_id]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED', 'ON_HOLD', 'EXPIRED', 'UNATTEMPTED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('BKASH', 'SSL');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropIndex
DROP INDEX "Appointment_doctorId_idx";

-- DropIndex
DROP INDEX "Appointment_userId_idx";

-- DropIndex
DROP INDEX "PatientReview_status_isSuccessStory_sortOrder_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "attendTime",
DROP COLUMN "doctorId",
DROP COLUMN "userId",
ALTER COLUMN "problem" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PatientReview" DROP COLUMN "age",
DROP COLUMN "isSuccessStory",
DROP COLUMN "problems",
DROP COLUMN "result",
DROP COLUMN "treatments",
DROP COLUMN "videoTitle";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "expiredAt" TIMESTAMP(3),
ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "paymentResolvedAt" TIMESTAMP(3),
ADD COLUMN     "providerRaw" JSONB,
ADD COLUMN     "providerStatus" TEXT,
ADD COLUMN     "providerStatusReason" TEXT,
ADD COLUMN     "providerValId" TEXT,
ADD COLUMN     "transaction_id" TEXT;

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "transaction_id" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "merchantInvoiceNumber" TEXT,
    "providerPaymentId" TEXT,
    "providerTrxId" TEXT,
    "providerStatus" TEXT,
    "providerStatusReason" TEXT,
    "providerValId" TEXT,
    "providerRaw" JSONB,
    "paymentResolvedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedByAdminId" TEXT,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_transaction_id_key" ON "Purchase"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_merchantInvoiceNumber_key" ON "Purchase"("merchantInvoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_providerPaymentId_key" ON "Purchase"("providerPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_providerTrxId_key" ON "Purchase"("providerTrxId");

-- CreateIndex
CREATE INDEX "Purchase_userId_productId_idx" ON "Purchase"("userId", "productId");

-- CreateIndex
CREATE INDEX "Purchase_status_idx" ON "Purchase"("status");

-- CreateIndex
CREATE INDEX "Purchase_provider_idx" ON "Purchase"("provider");

-- CreateIndex
CREATE INDEX "Purchase_providerStatus_idx" ON "Purchase"("providerStatus");

-- CreateIndex
CREATE INDEX "Purchase_providerValId_idx" ON "Purchase"("providerValId");

-- CreateIndex
CREATE INDEX "PatientReview_status_sortOrder_idx" ON "PatientReview"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transaction_id_key" ON "Payment"("transaction_id");
