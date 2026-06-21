-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "meta" JSONB;

-- CreateTable
CREATE TABLE "AnalyticsSetting" (
    "id" TEXT NOT NULL,
    "isSingleton" BOOLEAN NOT NULL DEFAULT true,
    "pixelId" TEXT,
    "accessToken" TEXT,
    "testEventCode" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSetting_isSingleton_key" ON "AnalyticsSetting"("isSingleton");
