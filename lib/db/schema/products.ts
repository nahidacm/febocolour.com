import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "@/lib/db/schema/categories";
import { productKindEnum, stockStatusEnum } from "@/lib/db/schema/enums";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  sku: varchar("sku", { length: 60 }).notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description"),
  specifications: jsonb("specifications").$type<Record<string, string>>(),
  sizeChart: jsonb("size_chart").$type<Record<string, string> | { image: string }>(),
  productKind: productKindEnum("product_kind").notNull().default("physical"),
  regularPrice: numeric("regular_price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  saleStartsAt: timestamp("sale_starts_at", { withTimezone: true }),
  saleEndsAt: timestamp("sale_ends_at", { withTimezone: true }),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  stockStatus: stockStatusEnum("stock_status").notNull().default("in_stock"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestSeller: boolean("is_best_seller").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  ratingAvg: numeric("rating_avg", { precision: 2, scale: 1 }).notNull().default("0"),
  ratingCount: integer("rating_count").notNull().default(0),
  seoTitle: varchar("seo_title", { length: 160 }),
  seoDescription: text("seo_description"),
  ogImage: varchar("og_image", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  storageKey: varchar("storage_key", { length: 255 }).notNull(),
  altText: varchar("alt_text", { length: 200 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productVideos = pgTable("product_videos", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  storageKeyOrUrl: varchar("storage_key_or_url", { length: 500 }).notNull(),
  thumbnailKey: varchar("thumbnail_key", { length: 255 }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
