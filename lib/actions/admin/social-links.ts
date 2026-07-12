"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { socialLinkSchema } from "@/lib/validation/admin/social-link";
import {
  createSocialLink,
  deleteSocialLink,
  getSocialLinkForAdmin,
  updateSocialLink,
} from "@/lib/services/admin/social-links";

export type SocialLinkFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function saveSocialLinkAction(
  _prevState: SocialLinkFormState,
  formData: FormData,
): Promise<SocialLinkFormState> {
  const admin = await requireAdmin();
  const idRaw = formData.get("id")?.toString();
  const id = idRaw ? Number(idRaw) : null;

  const parsed = socialLinkSchema.safeParse({
    platform: formData.get("platform")?.toString() ?? "",
    url: formData.get("url")?.toString() ?? "",
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

  if (id) {
    await updateSocialLink(id, parsed.data);
    await writeAuditLog({ adminUserId: admin.id, action: "update", entityType: "social_link", entityId: id });
  } else {
    const row = await createSocialLink(parsed.data);
    await writeAuditLog({ adminUserId: admin.id, action: "create", entityType: "social_link", entityId: row.id });
  }

  revalidatePath("/admin/social-links");
  revalidatePath("/");
  redirect("/admin/social-links");
}

export async function deleteSocialLinkAction(id: number) {
  const admin = await requireAdmin();
  const link = await getSocialLinkForAdmin(id);
  await deleteSocialLink(id);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete",
    entityType: "social_link",
    entityId: id,
    changes: link ? { platform: link.platform } : undefined,
  });
  revalidatePath("/admin/social-links");
  revalidatePath("/");
}
