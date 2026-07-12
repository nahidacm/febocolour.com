"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { bannerSchema } from "@/lib/validation/admin/banner";
import { createBanner, deleteBanner, getBannerForAdmin, updateBanner } from "@/lib/services/admin/banners";
import { deleteFile, saveFile } from "@/lib/storage/local";

export type BannerFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function saveBannerAction(
  _prevState: BannerFormState,
  formData: FormData,
): Promise<BannerFormState> {
  const admin = await requireAdmin();
  const idRaw = formData.get("id")?.toString();
  const id = idRaw ? Number(idRaw) : null;

  const parsed = bannerSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    subtitle: formData.get("subtitle")?.toString() ?? "",
    ctaLabel: formData.get("ctaLabel")?.toString() ?? "",
    ctaUrl: formData.get("ctaUrl")?.toString() ?? "",
    secondaryCtaLabel: formData.get("secondaryCtaLabel")?.toString() ?? "",
    secondaryCtaUrl: formData.get("secondaryCtaUrl")?.toString() ?? "",
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

  const imageFile = formData.get("image");
  const hasNewImage = imageFile instanceof File && imageFile.size > 0;

  if (!id && !hasNewImage) {
    return { error: "Please choose an image." };
  }

  const imageKey = hasNewImage ? await saveFile(imageFile as File, "banners") : undefined;

  if (id) {
    const previous = await getBannerForAdmin(id);
    await updateBanner(id, parsed.data, imageKey);
    if (imageKey && previous?.image) await deleteFile(previous.image);
    await writeAuditLog({ adminUserId: admin.id, action: "update", entityType: "banner", entityId: id });
  } else {
    const row = await createBanner(parsed.data, imageKey!);
    await writeAuditLog({ adminUserId: admin.id, action: "create", entityType: "banner", entityId: row.id });
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBannerAction(id: number) {
  const admin = await requireAdmin();
  const banner = await getBannerForAdmin(id);
  await deleteBanner(id);
  if (banner?.image) await deleteFile(banner.image);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete",
    entityType: "banner",
    entityId: id,
    changes: banner ? { title: banner.title } : undefined,
  });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
