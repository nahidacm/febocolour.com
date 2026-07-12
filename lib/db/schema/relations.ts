import { relations } from "drizzle-orm";
import { categories } from "@/lib/db/schema/categories";
import { productImages, productVideos, products } from "@/lib/db/schema/products";
import {
  attributes,
  attributeValues,
  productAttributes,
  productVariants,
  productVariantValues,
} from "@/lib/db/schema/attributes";
import { cartItems, carts } from "@/lib/db/schema/cart";
import { orderItems, orderPaymentDetails, orders } from "@/lib/db/schema/orders";
import { paymentMethodConfigs, shippingMethodConfigs } from "@/lib/db/schema/config";
import { addresses, adminSessions, adminUsers, customerSessions, customers } from "@/lib/db/schema/auth";
import { reviews } from "@/lib/db/schema/reviews";
import { auditLogs } from "@/lib/db/schema/audit";

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryParent",
  }),
  children: many(categories, { relationName: "categoryParent" }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  videos: many(productVideos),
  productAttributes: many(productAttributes),
  variants: many(productVariants),
  reviews: many(reviews),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVideosRelations = relations(productVideos, ({ one }) => ({
  product: one(products, {
    fields: [productVideos.productId],
    references: [products.id],
  }),
}));

export const attributesRelations = relations(attributes, ({ many }) => ({
  values: many(attributeValues),
  productAttributes: many(productAttributes),
}));

export const attributeValuesRelations = relations(attributeValues, ({ one, many }) => ({
  attribute: one(attributes, {
    fields: [attributeValues.attributeId],
    references: [attributes.id],
  }),
  variantValues: many(productVariantValues),
}));

export const productAttributesRelations = relations(productAttributes, ({ one }) => ({
  product: one(products, {
    fields: [productAttributes.productId],
    references: [products.id],
  }),
  attribute: one(attributes, {
    fields: [productAttributes.attributeId],
    references: [attributes.id],
  }),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  image: one(productImages, {
    fields: [productVariants.imageId],
    references: [productImages.id],
  }),
  variantValues: many(productVariantValues),
}));

export const productVariantValuesRelations = relations(productVariantValues, ({ one }) => ({
  variant: one(productVariants, {
    fields: [productVariantValues.variantId],
    references: [productVariants.id],
  }),
  attributeValue: one(attributeValues, {
    fields: [productVariantValues.attributeValueId],
    references: [attributeValues.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  items: many(cartItems),
  customer: one(customers, {
    fields: [carts.customerId],
    references: [customers.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const shippingMethodConfigsRelations = relations(shippingMethodConfigs, ({ many }) => ({
  orders: many(orders),
}));

export const paymentMethodConfigsRelations = relations(paymentMethodConfigs, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  shippingMethod: one(shippingMethodConfigs, {
    fields: [orders.shippingMethodId],
    references: [shippingMethodConfigs.id],
  }),
  paymentMethod: one(paymentMethodConfigs, {
    fields: [orders.paymentMethodId],
    references: [paymentMethodConfigs.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  paymentDetails: many(orderPaymentDetails),
}));

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  sessions: many(adminSessions),
  auditLogs: many(auditLogs),
}));

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
  adminUser: one(adminUsers, {
    fields: [adminSessions.adminUserId],
    references: [adminUsers.id],
  }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  sessions: many(customerSessions),
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  carts: many(carts),
}));

export const customerSessionsRelations = relations(customerSessions, ({ one }) => ({
  customer: one(customers, {
    fields: [customerSessions.customerId],
    references: [customers.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  adminUser: one(adminUsers, {
    fields: [auditLogs.adminUserId],
    references: [adminUsers.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const orderPaymentDetailsRelations = relations(orderPaymentDetails, ({ one }) => ({
  order: one(orders, {
    fields: [orderPaymentDetails.orderId],
    references: [orders.id],
  }),
  verifiedByAdmin: one(adminUsers, {
    fields: [orderPaymentDetails.verifiedByAdminId],
    references: [adminUsers.id],
  }),
}));
