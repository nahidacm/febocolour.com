"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { categorySchema } from "@/lib/validation/admin/category";
import {
  createCategory,
  deleteCategory,
  getCategoryForAdmin,
  updateCategory,
} from "@/lib/services/admin/categories";
import { deleteFile, saveFile } from "@/lib/storage/local";

export type CategoryFormState = { error?: string; fieldErrors?: Record<string, string> };

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  if (slug) revalidatePath(`/category/${slug}`);
}

export async function saveCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const admin = await requireAdmin();
  const idRaw = formData.get("id")?.toString();
  const id = idRaw ? Number(idRaw) : null;

  const parsed = categorySchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    parentId: formData.get("parentId")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    sortOrder: formData.get("sortOrder")?.toString() ?? "0",
    seoTitle: formData.get("seoTitle")?.toString() ?? "",
    seoDescription: formData.get("seoDescription")?.toString() ?? "",
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
  const imageKey = hasNewImage ? await saveFile(imageFile as File, "categories") : undefined;

  try {
    if (id) {
      const previous = await getCategoryForAdmin(id);
      const category = await updateCategory(id, parsed.data, imageKey);
      if (imageKey && previous?.image) await deleteFile(previous.image);
      await writeAuditLog({
        adminUserId: admin.id,
        action: "update",
        entityType: "category",
        entityId: id,
        changes: { name: category.name, slug: category.slug },
      });
      revalidateStorefront(category.slug);
      revalidatePath("/admin/categories");
      return {};
    }

    const category = await createCategory(parsed.data, imageKey);
    await writeAuditLog({
      adminUserId: admin.id,
      action: "create",
      entityType: "category",
      entityId: category.id,
      changes: { name: category.name, slug: category.slug },
    });
    revalidateStorefront(category.slug);
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      return { error: "A category with that slug already exists." };
    }
    throw err;
  }

  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: number) {
  const admin = await requireAdmin();
  const category = await getCategoryForAdmin(id);
  await deleteCategory(id);
  if (category?.image) await deleteFile(category.image);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete",
    entityType: "category",
    entityId: id,
    changes: category ? { name: category.name, slug: category.slug } : undefined,
  });
  revalidateStorefront(category?.slug);
  revalidatePath("/admin/categories");
}
