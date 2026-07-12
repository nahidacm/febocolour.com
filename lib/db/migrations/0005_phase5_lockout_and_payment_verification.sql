ALTER TABLE "admin_users" ADD COLUMN "failed_login_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "locked_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "failed_login_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "locked_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order_payment_details" ADD COLUMN "verified_by_admin_id" integer;--> statement-breakpoint
ALTER TABLE "order_payment_details" ADD CONSTRAINT "order_payment_details_verified_by_admin_id_admin_users_id_fk" FOREIGN KEY ("verified_by_admin_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;