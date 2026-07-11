CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'awaiting_verification', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."shipping_rate_type" AS ENUM('flat', 'free', 'manual');--> statement-breakpoint
CREATE TABLE "payment_method_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(40) NOT NULL,
	"name" varchar(100) NOT NULL,
	"instructions" text,
	"account_details" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"requires_manual_verification" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_method_configs_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "shipping_method_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(40) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"rate_type" "shipping_rate_type" DEFAULT 'flat' NOT NULL,
	"flat_rate" numeric(10, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipping_method_configs_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"variant_id" integer,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"cart_token_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "carts_cart_token_hash_unique" UNIQUE("cart_token_hash")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer,
	"variant_id" integer,
	"product_name_snapshot" varchar(200) NOT NULL,
	"variant_label_snapshot" varchar(255),
	"sku_snapshot" varchar(60) NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_payment_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"payment_method_code" varchar(40) NOT NULL,
	"sender_number" varchar(30),
	"transaction_id" varchar(100),
	"amount" numeric(10, 2) NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(20) NOT NULL,
	"shipping_full_name" varchar(150) NOT NULL,
	"shipping_phone" varchar(30) NOT NULL,
	"shipping_address_line" text NOT NULL,
	"shipping_city" varchar(100) NOT NULL,
	"shipping_area" varchar(100),
	"shipping_postal_code" varchar(20),
	"notes" text,
	"shipping_method_id" integer NOT NULL,
	"shipping_cost" numeric(10, 2) NOT NULL,
	"payment_method_id" integer NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"order_status" "order_status" DEFAULT 'pending' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"discount_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"coupon_code" varchar(40),
	"total" numeric(10, 2) NOT NULL,
	"currency" char(3) DEFAULT 'BDT' NOT NULL,
	"placed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_payment_details" ADD CONSTRAINT "order_payment_details_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_method_id_shipping_method_configs_id_fk" FOREIGN KEY ("shipping_method_id") REFERENCES "public"."shipping_method_configs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_method_id_payment_method_configs_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_method_configs"("id") ON DELETE restrict ON UPDATE no action;