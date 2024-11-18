ALTER TABLE "patient" ALTER COLUMN "height" SET DATA TYPE numeric(4, 2);--> statement-breakpoint
ALTER TABLE "vital_signs" ALTER COLUMN "height" SET DATA TYPE numeric(4, 2);--> statement-breakpoint
ALTER TABLE "vital_signs" ALTER COLUMN "weight" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "vital_signs" ALTER COLUMN "systolic_pressure" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "vital_signs" ALTER COLUMN "diastolic_pressure" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "vital_signs" ALTER COLUMN "heart_rate" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "vital_signs" ALTER COLUMN "body_temperature" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "vital_signs" ALTER COLUMN "respiratory_rate" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "vital_signs" ALTER COLUMN "bmi" SET DATA TYPE numeric(4, 1);