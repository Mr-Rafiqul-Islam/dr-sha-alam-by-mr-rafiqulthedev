-- CreateEnum
CREATE TYPE "DeleteRequestEntityType" AS ENUM ('BLOG', 'APPOINTMENT', 'CONTACT_MESSAGE');

-- CreateEnum
CREATE TYPE "DeleteRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityAction" ADD VALUE 'APPOINTMENT_CREATED';
ALTER TYPE "ActivityAction" ADD VALUE 'BLOG_IMAGE_UPLOADED';
ALTER TYPE "ActivityAction" ADD VALUE 'BLOG_IMAGE_DELETED';

-- CreateTable
CREATE TABLE "DeleteRequest" (
    "id" TEXT NOT NULL,
    "entityType" "DeleteRequestEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" "DeleteRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "DeleteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeleteRequest_status_entityType_idx" ON "DeleteRequest"("status", "entityType");

-- CreateIndex
CREATE INDEX "DeleteRequest_entityType_entityId_idx" ON "DeleteRequest"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "DeleteRequest" ADD CONSTRAINT "DeleteRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeleteRequest" ADD CONSTRAINT "DeleteRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
