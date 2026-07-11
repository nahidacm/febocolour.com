import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { productImages, products } from "@/lib/db/schema/products";
import { attributeInputTypeEnum, stockStatusEnum } from "@/lib/db/schema/enums";

export const attributes = pgTable("attributes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  inputType: attributeInputTypeEnum("input_type").notNull().default("select"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const attributeValues = pgTable(
  "attribute_values",
  {
    id: serial("id").primaryKey(),
    attributeId: integer("attribute_id")
      .notNull()
      .references(() => attributes.id, { onDelete: "cascade" }),
    value: varchar("value", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    swatchHex: varchar("swatch_hex", { length: 7 }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [unique().on(table.attributeId, table.slug)],
);

export const productAttributes = pgTable(
  "product_attributes",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    attributeId: integer("attribute_id")
      .notNull()
      .references(() => attributes.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [unique().on(table.productId, table.attributeId)],
);

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: varchar("sku", { length: 60 }).notNull().unique(),
  priceOverride: numeric("price_override", { precision: 10, scale: 2 }),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  stockStatus: stockStatusEnum("stock_status").notNull().default("in_stock"),
  imageId: integer("image_id").references(() => productImages.id, {
    onDelete: "set null",
  }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productVariantValues = pgTable(
  "product_variant_values",
  {
    id: serial("id").primaryKey(),
    variantId: integer("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    attributeValueId: integer("attribute_value_id")
      .notNull()
      .references(() => attributeValues.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.variantId, table.attributeValueId)],
);
