import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { paymentMethodConfigs, shippingMethodConfigs } from "@/lib/db/schema";

export async function getActiveShippingMethods() {
  return db.query.shippingMethodConfigs.findMany({
    where: eq(shippingMethodConfigs.isActive, true),
    orderBy: asc(shippingMethodConfigs.sortOrder),
  });
}

export async function getActivePaymentMethods() {
  return db.query.paymentMethodConfigs.findMany({
    where: eq(paymentMethodConfigs.isActive, true),
    orderBy: asc(paymentMethodConfigs.sortOrder),
  });
}
