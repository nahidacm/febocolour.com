import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { paymentMethodConfigs } from "@/lib/db/schema";
import type { z } from "zod";
import type { paymentMethodSchema } from "@/lib/validation/admin/payment";
import { parseKeyValueLines } from "@/lib/utils/kv-text";

type PaymentInput = z.infer<typeof paymentMethodSchema>;

export async function listPaymentMethodsForAdmin() {
  return db.query.paymentMethodConfigs.findMany({ orderBy: asc(paymentMethodConfigs.sortOrder) });
}

export async function getPaymentMethodForAdmin(id: number) {
  return db.query.paymentMethodConfigs.findFirst({ where: eq(paymentMethodConfigs.id, id) });
}

function toRow(input: PaymentInput) {
  return {
    code: input.code,
    name: input.name,
    instructions: input.instructions || null,
    accountDetails: input.accountDetails ? parseKeyValueLines(input.accountDetails) : null,
    sortOrder: input.sortOrder ?? 0,
    requiresManualVerification: input.requiresManualVerification ?? false,
    isActive: input.isActive ?? false,
  };
}

export async function createPaymentMethod(input: PaymentInput) {
  const [row] = await db.insert(paymentMethodConfigs).values(toRow(input)).returning();
  return row;
}

export async function updatePaymentMethod(id: number, input: PaymentInput) {
  const [row] = await db
    .update(paymentMethodConfigs)
    .set({ ...toRow(input), updatedAt: new Date() })
    .where(eq(paymentMethodConfigs.id, id))
    .returning();
  return row;
}

export async function deletePaymentMethod(id: number) {
  await db.delete(paymentMethodConfigs).where(eq(paymentMethodConfigs.id, id));
}
