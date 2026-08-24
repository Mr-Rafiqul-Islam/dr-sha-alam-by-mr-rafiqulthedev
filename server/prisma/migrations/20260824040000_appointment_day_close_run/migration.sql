-- CreateTable
CREATE TABLE "AppointmentDayCloseRun" (
    "id" TEXT NOT NULL,
    "siteRef" "SiteRef" NOT NULL,
    "businessDate" TEXT NOT NULL,
    "closedCount" INTEGER NOT NULL,
    "closedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentDayCloseRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentDayCloseRun_siteRef_businessDate_key" ON "AppointmentDayCloseRun"("siteRef", "businessDate");
