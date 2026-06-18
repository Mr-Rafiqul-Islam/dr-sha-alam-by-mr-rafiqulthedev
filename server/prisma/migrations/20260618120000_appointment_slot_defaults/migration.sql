-- CreateTable
CREATE TABLE "AppointmentSlotDefaultConfig" (
    "id" TEXT NOT NULL,
    "siteRef" "SiteRef" NOT NULL,
    "defaultSeatLimit" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentSlotDefaultConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentSlotDefault" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "smsLabel" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "seatLimit" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentSlotDefault_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentSlotDefaultConfig_siteRef_key" ON "AppointmentSlotDefaultConfig"("siteRef");

-- CreateIndex
CREATE INDEX "AppointmentSlotDefault_configId_isActive_idx" ON "AppointmentSlotDefault"("configId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentSlotDefault_configId_code_key" ON "AppointmentSlotDefault"("configId", "code");

-- AddForeignKey
ALTER TABLE "AppointmentSlotDefault" ADD CONSTRAINT "AppointmentSlotDefault_configId_fkey" FOREIGN KEY ("configId") REFERENCES "AppointmentSlotDefaultConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
