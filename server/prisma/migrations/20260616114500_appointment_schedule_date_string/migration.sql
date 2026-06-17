ALTER TABLE "AppointmentSchedule"
ALTER COLUMN "date" TYPE TEXT
USING "date"::date::text;
