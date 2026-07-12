ALTER TABLE "orders" ADD COLUMN "courier_consignment_id" varchar(40);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "courier_tracking_code" varchar(60);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "courier_status" varchar(40);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "courier_sent_at" timestamp with time zone;