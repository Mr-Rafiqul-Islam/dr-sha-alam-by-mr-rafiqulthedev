-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PATIENT', 'DOCTOR', 'EDITOR');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'ATTEND', 'CANCEL', 'RESCHEDULED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "SiteRef" AS ENUM ('DOCTOR_SHA_ALAM', 'TRUE_CARE_HELLING_CENTER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "AttendTime" AS ENUM ('M10', 'A03');

-- CreateEnum
CREATE TYPE "PatientProblem" AS ENUM ('PLID', 'KNEEPAIN', 'BACKPAIN');

-- CreateEnum
CREATE TYPE "PatientReviewVideoType" AS ENUM ('MUX', 'EMBED', 'DIRECT');

-- CreateEnum
CREATE TYPE "PatientReviewStatus" AS ENUM ('PENDING', 'ACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "image" TEXT,
    "password" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PATIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "doctorId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "specialization" TEXT NOT NULL,
    "about" TEXT,
    "experience" INTEGER,
    "consultationFee" DOUBLE PRECISION,
    "location" TEXT,
    "availableDays" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "doctorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "problem" "PatientProblem" NOT NULL DEFAULT 'PLID',
    "serialNumber" INTEGER NOT NULL,
    "attendTime" "AttendTime" NOT NULL DEFAULT 'M10',
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "siteRef" "SiteRef" NOT NULL DEFAULT 'DOCTOR_SHA_ALAM',
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "tranId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "gateway" TEXT,
    "valId" TEXT,
    "gatewayResponse" JSONB,
    "userId" TEXT,
    "doctorId" TEXT,
    "appointmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "comments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isFeatured" BOOLEAN NOT NULL,
    "slug" TEXT NOT NULL,
    "meta" JSONB DEFAULT '{}',
    "notes" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientReview" (
    "id" TEXT NOT NULL,
    "status" "PatientReviewStatus" NOT NULL DEFAULT 'PENDING',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isSuccessStory" BOOLEAN NOT NULL DEFAULT false,
    "authorUserId" TEXT,
    "patientDisplayName" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "age" INTEGER,
    "rating" INTEGER NOT NULL,
    "problems" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "treatments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "result" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "videoType" "PatientReviewVideoType",
    "muxUploadId" TEXT,
    "muxAssetId" TEXT,
    "muxPlaybackId" TEXT,
    "muxPlaybackPolicy" TEXT DEFAULT 'signed',
    "videoThumbnailUrl" TEXT,
    "videoTitle" TEXT,
    "embedPayload" JSONB,
    "directVideoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "Doctor_specialization_idx" ON "Doctor"("specialization");

-- CreateIndex
CREATE INDEX "Doctor_location_idx" ON "Doctor"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_transactionId_key" ON "Appointment"("transactionId");

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_idx" ON "Appointment"("appointmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_tranId_key" ON "Payment"("tranId");

-- CreateIndex
CREATE INDEX "Payment_tranId_idx" ON "Payment"("tranId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_doctorId_idx" ON "Payment"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_published_createdAt_idx" ON "Blog"("published", "createdAt");

-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "Blog"("category");

-- CreateIndex
CREATE INDEX "PatientReview_status_isSuccessStory_sortOrder_idx" ON "PatientReview"("status", "isSuccessStory", "sortOrder");

-- CreateIndex
CREATE INDEX "PatientReview_authorUserId_idx" ON "PatientReview"("authorUserId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientReview" ADD CONSTRAINT "PatientReview_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
