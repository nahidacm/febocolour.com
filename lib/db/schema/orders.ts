import {
  char,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { products } from "@/lib/db/schema/products";
import { productVariants } from "@/lib/db/schema/attributes";
import { paymentMethodConfigs, shippingMethodConfigs } from "@/lib/db/schema/config";
import { orderStatusEnum, paymentStatusEnum } from "@/lib/db/schema/enums";
import { adminUsers, customers } from "@/lib/db/schema/auth";

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 40 }).notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
  shippingFullName: varchar("shipping_full_name", { length: 150 }).notNull(),
  shippingPhone: varchar("shipping_phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),
  shippingAddressLine: text("shipping_address_line").notNull(),
  shippingCity: varchar("shipping_city", { length: 100 }).notNull(),
  shippingArea: varchar("shipping_area", { length: 100 }),
  shippingPostalCode: varchar("shipping_postal_code", { length: 20 }),
  notes: text("notes"),
  shippingMethodId: integer("shipping_method_id")
    .notNull()
    .references(() => shippingMethodConfigs.id, { onDelete: "restrict" }),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).notNull(),
  paymentMethodId: integer("payment_method_id")
    .notNull()
    .references(() => paymentMethodConfigs.id, { onDelete: "restrict" }),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  orderStatus: orderStatusEnum("order_status").notNull().default("pending"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountTotal: numeric("discount_total", { precision: 10, scale: 2 }).notNull().default("0"),
  couponCode: varchar("coupon_code", { length: 40 }),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: char("currency", { length: 3 }).notNull().default("BDT"),
  placedAt: timestamp("placed_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: integer("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),
  productNameSnapshot: varchar("product_name_snapshot", { length: 200 }).notNull(),
  variantLabelSnapshot: varchar("variant_label_snapshot", { length: 255 }),
  skuSnapshot: varchar("sku_snapshot", { length: 60 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: numeric("line_total", { precision: 10, scale: 2 }).notNull(),
});

export const orderPaymentDetails = pgTable("order_payment_details", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  paymentMethodCode: varchar("payment_method_code", { length: 40 }).notNull(),
  senderNumber: varchar("sender_number", { length: 30 }),
  transactionId: varchar("transaction_id", { length: 100 }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  verifiedByAdminId: integer("verified_by_admin_id").references(() => adminUsers.id, {
    onDelete: "set null",
  }),
});
