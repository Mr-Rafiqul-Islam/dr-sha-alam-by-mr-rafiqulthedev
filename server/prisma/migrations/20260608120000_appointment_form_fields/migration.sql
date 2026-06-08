-- AlterEnum
ALTER TYPE "AttendTime" ADD VALUE 'A05';

-- AlterTable
ALTER TABLE "Appointment" RENAME COLUMN "location" TO "homeAddress";

ALTER TABLE "Appointment" ADD COLUMN "email" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "preferredTime" TEXT NOT NULL DEFAULT 'GENERAL';
ALTER TABLE "Appointment" ALTER COLUMN "preferredTime" DROP DEFAULT;

ALTER TABLE "Appointment" ALTER COLUMN "gender" DROP NOT NULL;

ALTER TABLE "Appointment" ALTER COLUMN "problem" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "problem" TYPE TEXT USING "problem"::TEXT;

-- DropEnum
DROP TYPE "PatientProblem";
