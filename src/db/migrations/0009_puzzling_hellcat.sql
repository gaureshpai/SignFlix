ALTER TABLE "provider" ALTER COLUMN "specialty" SET DEFAULT 'Primary Care Physician';--> statement-breakpoint
ALTER TABLE "provider" ALTER COLUMN "license_number" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "provider" ALTER COLUMN "license_number" SET DEFAULT 'LIC100000123';