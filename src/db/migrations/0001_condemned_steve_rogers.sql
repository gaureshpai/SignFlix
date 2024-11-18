ALTER TABLE "address" RENAME COLUMN "address" TO "address_line_1";--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "address_line_2" varchar(100);