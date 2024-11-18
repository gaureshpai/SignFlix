ALTER TABLE "appointment" ALTER COLUMN "appointment_status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "procedure" ADD COLUMN "procedure_time" time DEFAULT '10:00:00' NOT NULL;--> statement-breakpoint
ALTER TABLE "vital_signs" DROP COLUMN IF EXISTS "measured_at";