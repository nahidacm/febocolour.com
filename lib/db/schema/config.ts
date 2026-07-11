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
import { shippingRateTypeEnum } from "@/lib/db/schema/enums";

export const homepageBanners = pgTable("homepage_banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: varchar("subtitle", { length: 300 }),
  image: varchar("image", { length: 255 }).notNull(),
  mobileImage: varchar("mobile_image", { length: 255 }),
  ctaLabel: varchar("cta_label", { length: 80 }),
  ctaUrl: varchar("cta_url", { length: 255 }),
  secondaryCtaLabel: varchar("secondary_cta_label", { length: 80 }),
  secondaryCtaUrl: varchar("secondary_cta_url", { length: 255 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const socialLinks = pgTable("social_links", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 40 }).notNull(),
  url: varchar("url", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const shippingMethodConfigs = pgTable("shipping_method_configs", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  rateType: shippingRateTypeEnum("rate_type").notNull().default("flat"),
  flatRate: numeric("flat_rate", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentMethodConfigs = pgTable("payment_method_configs", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  instructions: text("instructions"),
  accountDetails: jsonb("account_details").$type<Record<string, string>>(),
  isActive: boolean("is_active").notNull().default(true),
  requiresManualVerification: boolean("requires_manual_verification").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
