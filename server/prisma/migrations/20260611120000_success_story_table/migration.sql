-- CreateTable
CREATE TABLE "SuccessStory" (
    "id" TEXT NOT NULL,
    "status" "PatientReviewStatus" NOT NULL DEFAULT 'PENDING',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "patientName" TEXT NOT NULL,
    "patientReview" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "problems" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "treatments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "result" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuccessStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SuccessStory_status_sortOrder_idx" ON "SuccessStory"("status", "sortOrder");
