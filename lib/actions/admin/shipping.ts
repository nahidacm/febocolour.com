"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { shippingMethodSchema } from "@/lib/validation/admin/shipping";
import {
  createShippingMethod,
  deleteShippingMethod,
  getShippingMethodForAdmin,
  updateShippingMethod,
} from "@/lib/services/admin/shipping";

export type ShippingFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function saveShippingMethodAction(
  _prevState: ShippingFormState,
  formData: FormData,
): Promise<ShippingFormState> {
  const admin = await requireAdmin();
  const idRaw = formData.get("id")?.toString();
  const id = idRaw ? Number(idRaw) : null;

  const parsed = shippingMethodSchema.safeParse({
    code: formData.get("code")?.toString() ?? "",
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    rateType: formData.get("rateType")?.toString() ?? "flat",
    flatRate: formData.get("flatRate")?.toString() ?? "",
    sortOrder: formData.get("sortOrder")?.toString() ?? "0",
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
      await updateShippingMethod(id, parsed.data);
      await writeAuditLog({ adminUserId: admin.id, action: "update", entityType: "shipping_method", entityId: id });
    } else {
      const row = await createShippingMethod(parsed.data);
      await writeAuditLog({ adminUserId: admin.id, action: "create", entityType: "shipping_method", entityId: row.id });
    }
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      return { error: "A shipping method with that code already exists." };
    }
    throw err;
  }

  revalidatePath("/admin/shipping");
  revalidatePath("/cart");
  redirect("/admin/shipping");
}

export async function deleteShippingMethodAction(id: number) {
  const admin = await requireAdmin();
  const row = await getShippingMethodForAdmin(id);
  await deleteShippingMethod(id);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete",
    entityType: "shipping_method",
    entityId: id,
    changes: row ? { name: row.name } : undefined,
  });
  revalidatePath("/admin/shipping");
  revalidatePath("/cart");
}
