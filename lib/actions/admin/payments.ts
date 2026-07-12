"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { paymentMethodSchema } from "@/lib/validation/admin/payment";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethodForAdmin,
  updatePaymentMethod,
} from "@/lib/services/admin/payments";

export type PaymentFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function savePaymentMethodAction(
  _prevState: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> {
  const admin = await requireAdmin();
  const idRaw = formData.get("id")?.toString();
  const id = idRaw ? Number(idRaw) : null;

  const parsed = paymentMethodSchema.safeParse({
    code: formData.get("code")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
    instructions: formData.get("instructions")?.toString() ?? "",
    accountDetails: formData.get("accountDetails")?.toString() ?? "",
    sortOrder: formData.get("sortOrder")?.toString() ?? "0",
    requiresManualVerification: formData.get("requiresManualVerification") === "on",
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  try {
    if (id) {
      await updatePaymentMethod(id, parsed.data);
      await writeAuditLog({ adminUserId: admin.id, action: "update", entityType: "payment_method", entityId: id });
    } else {
      const row = await createPaymentMethod(parsed.data);
      await writeAuditLog({ adminUserId: admin.id, action: "create", entityType: "payment_method", entityId: row.id });
    }
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      return { error: "A payment method with that code already exists." };
    }
    throw err;
  }

  revalidatePath("/admin/payments");
  revalidatePath("/checkout");
  redirect("/admin/payments");
}

export async function deletePaymentMethodAction(id: number) {
  const admin = await requireAdmin();
  const row = await getPaymentMethodForAdmin(id);
  await deletePaymentMethod(id);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete",
    entityType: "payment_method",
    entityId: id,
    changes: row ? { name: row.name } : undefined,
  });
  revalidatePath("/admin/payments");
  revalidatePath("/checkout");
}
