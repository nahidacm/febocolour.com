"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { attributeSchema, attributeValueSchema } from "@/lib/validation/admin/attribute";
import {
  createAttribute,
  deleteAttribute,
  getAttributeForAdmin,
  updateAttribute,
} from "@/lib/services/admin/attributes";

export type AttributeFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function saveAttributeAction(
  _prevState: AttributeFormState,
  formData: FormData,
): Promise<AttributeFormState> {
  const admin = await requireAdmin();
  const idRaw = formData.get("id")?.toString();
  const id = idRaw ? Number(idRaw) : null;

  const parsed = attributeSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    inputType: formData.get("inputType")?.toString() ?? "select",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  let values;
  try {
    const raw = JSON.parse(formData.get("valuesJson")?.toString() ?? "[]");
    values = raw
      .map((v: unknown) => attributeValueSchema.safeParse(v))
      .filter((r: { success: boolean }) => r.success)
      .map((r: { data: unknown }) => r.data);
  } catch {
    return { error: "Invalid values payload." };
  }

  try {
    if (id) {
      const attribute = await updateAttribute(id, parsed.data, values);
      await writeAuditLog({
        adminUserId: admin.id,
        action: "update",
        entityType: "attribute",
        entityId: id,
        changes: { name: attribute.name },
      });
      revalidatePath("/admin/attributes");
      return {};
    }

    const attribute = await createAttribute(parsed.data, values);
    await writeAuditLog({
      adminUserId: admin.id,
      action: "create",
      entityType: "attribute",
      entityId: attribute.id,
      changes: { name: attribute.name },
    });
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      return { error: "An attribute with that slug already exists." };
    }
    throw err;
  }

  redirect("/admin/attributes");
}

export async function deleteAttributeAction(id: number) {
  const admin = await requireAdmin();
  const attribute = await getAttributeForAdmin(id);
  await deleteAttribute(id);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete",
    entityType: "attribute",
    entityId: id,
    changes: attribute ? { name: attribute.name } : undefined,
  });
  revalidatePath("/admin/attributes");
}
