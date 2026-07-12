"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { productSchema } from "@/lib/validation/admin/product";
import {
  addProductImage,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getProductForAdmin,
  getProductImage,
  replaceProductVariants,
  updateProduct,
  type VariantRowInput,
} from "@/lib/services/admin/products";
import { getCategoryForAdmin } from "@/lib/services/admin/categories";
import { deleteFile, saveFile } from "@/lib/storage/local";

export type ProductFormState = { error?: string; fieldErrors?: Record<string, string> };

// Category listing pages are ISR (5 min window) — bust them on write so a product
// that's added, removed, or moved between categories shows up immediately instead
// of waiting out the window. Pass both the old and new category slug on updates,
// since a product can move from one category to another.
function revalidateStorefront(slug?: string, categorySlugs: Array<string | undefined | null> = []) {
  revalidatePath("/");
  revalidatePath("/search");
  if (slug) revalidatePath(`/product/${slug}`);
  for (const catSlug of new Set(categorySlugs.filter((s): s is string => !!s))) {
    revalidatePath(`/category/${catSlug}`);
  }
}

export async function saveProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const admin = await requireAdmin();

  const idRaw = formData.get("id")?.toString();
  const id = idRaw ? Number(idRaw) : null;

  const parsed = productSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    sku: formData.get("sku")?.toString() ?? "",
    categoryId: formData.get("categoryId")?.toString() ?? "",
    shortDescription: formData.get("shortDescription")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    specifications: formData.get("specifications")?.toString() ?? "",
    sizeChart: formData.get("sizeChart")?.toString() ?? "",
    regularPrice: formData.get("regularPrice")?.toString() ?? "",
    salePrice: formData.get("salePrice")?.toString() ?? "",
    stockQuantity: formData.get("stockQuantity")?.toString() ?? "0",
    stockStatus: formData.get("stockStatus")?.toString() ?? "in_stock",
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

  const badges = {
    isFeatured: formData.get("isFeatured") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    isActive: formData.get("isActive") === "on",
  };

  try {
    if (id) {
      const existing = await getProductForAdmin(id);
      const product = await updateProduct(id, parsed.data, badges);
      const newCategory = product.categoryId ? await getCategoryForAdmin(product.categoryId) : null;
      await writeAuditLog({
        adminUserId: admin.id,
        action: "update",
        entityType: "product",
        entityId: id,
        changes: { name: product.name, slug: product.slug },
      });
      revalidateStorefront(product.slug, [existing?.category?.slug, newCategory?.slug]);
      revalidatePath(`/admin/products/${id}`);
      revalidatePath("/admin/products");
      return {};
    }

    const product = await createProduct(parsed.data, badges);
    const category = product.categoryId ? await getCategoryForAdmin(product.categoryId) : null;
    await writeAuditLog({
      adminUserId: admin.id,
      action: "create",
      entityType: "product",
      entityId: product.id,
      changes: { name: product.name, slug: product.slug },
    });
    revalidateStorefront(product.slug, [category?.slug]);
    revalidatePath("/admin/products");
    redirect(`/admin/products/${product.id}`);
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "23505") {
      return { error: "A product with that slug or SKU already exists." };
    }
    throw err;
  }

  return {};
}

export async function deleteProductAction(id: number) {
  const admin = await requireAdmin();
  const product = await getProductForAdmin(id);
  await deleteProduct(id);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete",
    entityType: "product",
    entityId: id,
    changes: product ? { name: product.name, slug: product.slug } : undefined,
  });
  revalidateStorefront(product?.slug, [product?.category?.slug]);
  revalidatePath("/admin/products");
}

export async function uploadProductImageAction(productId: number, formData: FormData) {
  const admin = await requireAdmin();
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const existing = await getProductForAdmin(productId);
  const hasExistingPrimary = existing?.images.some((img) => img.isPrimary) ?? false;

  let sortOrder = existing?.images.length ?? 0;
  for (const [i, file] of files.entries()) {
    const key = await saveFile(file, `products/${productId}`);
    await addProductImage(productId, key, !hasExistingPrimary && i === 0, sortOrder);
    sortOrder += 1;
  }

  await writeAuditLog({
    adminUserId: admin.id,
    action: "upload_images",
    entityType: "product",
    entityId: productId,
    changes: { count: files.length },
  });

  revalidateStorefront(existing?.slug, [existing?.category?.slug]);
  revalidatePath(`/admin/products/${productId}`);
}

export async function deleteProductImageAction(imageId: number, productId: number) {
  const admin = await requireAdmin();
  const image = await getProductImage(imageId);
  if (image) {
    await deleteProductImage(imageId);
    await deleteFile(image.storageKey);
  }
  const product = await getProductForAdmin(productId);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "delete_image",
    entityType: "product",
    entityId: productId,
  });
  revalidatePath(`/admin/products/${productId}`);
  revalidateStorefront(product?.slug, [product?.category?.slug]);
}

export async function saveProductVariantsAction({
  productId,
  attributeIds,
  variants,
}: {
  productId: number;
  attributeIds: number[];
  variants: VariantRowInput[];
}) {
  const admin = await requireAdmin();
  const product = await getProductForAdmin(productId);
  await replaceProductVariants(productId, attributeIds, variants);
  await writeAuditLog({
    adminUserId: admin.id,
    action: "update_variants",
    entityType: "product",
    entityId: productId,
    changes: { variantCount: variants.length },
  });
  revalidateStorefront(product?.slug, [product?.category?.slug]);
  revalidatePath(`/admin/products/${productId}`);
}
