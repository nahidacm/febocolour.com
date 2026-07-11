import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { products } from "@/lib/db/schema/products";
import { productVariants } from "@/lib/db/schema/attributes";
import { customers } from "@/lib/db/schema/auth";

export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  cartTokenHash: varchar("cart_token_hash", { length: 64 }).notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: integer("variant_id").references(() => productVariants.id, {
    onDelete: "cascade",
  }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
