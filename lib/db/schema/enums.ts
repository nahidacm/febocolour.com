import { pgEnum } from "drizzle-orm/pg-core";

export const productKindEnum = pgEnum("product_kind", [
  "physical",
  "digital",
  "bundle",
  "gift_card",
]);

export const stockStatusEnum = pgEnum("stock_status", [
  "in_stock",
  "out_of_stock",
  "backorder",
]);

export const attributeInputTypeEnum = pgEnum("attribute_input_type", [
  "select",
  "color_swatch",
]);

export const shippingRateTypeEnum = pgEnum("shipping_rate_type", [
  "flat",
  "free",
  "manual",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "awaiting_verification",
  "paid",
  "failed",
  "refunded",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
]);
