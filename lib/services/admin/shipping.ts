import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { shippingMethodConfigs } from "@/lib/db/schema";
import type { z } from "zod";
import type { shippingMethodSchema } from "@/lib/validation/admin/shipping";

type ShippingInput = z.infer<typeof shippingMethodSchema>;

export async function listShippingMethodsForAdmin() {
  return db.query.shippingMethodConfigs.findMany({ orderBy: asc(shippingMethodConfigs.sortOrder) });
}

export async function getShippingMethodForAdmin(id: number) {
  return db.query.shippingMethodConfigs.findFirst({ where: eq(shippingMethodConfigs.id, id) });
}

function toRow(input: ShippingInput) {
  return {
    code: input.code,
    name: input.name,
    description: input.description || null,
    rateType: input.rateType,
    flatRate: input.flatRate ? Number(input.flatRate).toFixed(2) : null,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? false,
  };
}

export async function createShippingMethod(input: ShippingInput) {
  const [row] = await db.insert(shippingMethodConfigs).values(toRow(input)).returning();
  return row;
}

export async function updateShippingMethod(id: number, input: ShippingInput) {
  const [row] = await db
    .update(shippingMethodConfigs)
    .set({ ...toRow(input), updatedAt: new Date() })
    .where(eq(shippingMethodConfigs.id, id))
    .returning();
  return row;
}

export async function deleteShippingMethod(id: number) {
  await db.delete(shippingMethodConfigs).where(eq(shippingMethodConfigs.id, id));
}
