ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'admin';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "gender" SET DEFAULT 'male';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "gender" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "date_of_birth" SET DEFAULT '1990-01-01';