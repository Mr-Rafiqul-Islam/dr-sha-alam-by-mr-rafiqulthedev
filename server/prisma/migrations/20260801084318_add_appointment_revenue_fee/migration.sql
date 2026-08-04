-- CreateEnum
CREATE TYPE "AppointmentRevenueCategory" AS ENUM ('NEW_PLID', 'OLD_PLID', 'GENERAL');

-- AlterEnum
ALTER TYPE "ActivityAction" ADD VALUE 'APPOINTMENT_REVENUE_FEES_UPDATED';

-- AlterEnum
ALTER TYPE "ActivityEntityType" ADD VALUE 'AppointmentRevenueFee';

-- CreateTable
CREATE TABLE "AppointmentRevenueFee" (
    "id" TEXT NOT NULL,
    "siteRef" "SiteRef" NOT NULL,
    "category" "AppointmentRevenueCategory" NOT NULL,
    "fee" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentRevenueFee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentRevenueFee_siteRef_isActive_idx" ON "AppointmentRevenueFee"("siteRef", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentRevenueFee_siteRef_category_key" ON "AppointmentRevenueFee"("siteRef", "category");
