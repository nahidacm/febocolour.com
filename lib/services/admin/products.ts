import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  productAttributes,
  productImages,
  productVariantValues,
  productVariants,
  products,
} from "@/lib/db/schema";
import type { ProductInput } from "@/lib/validation/admin/product";
import { parseKeyValueLines } from "@/lib/utils/kv-text";

export async function listProductsForAdmin() {
  return db.query.products.findMany({
    orderBy: desc(products.createdAt),
    with: { category: true, images: { limit: 1, where: eq(productImages.isPrimary, true) } },
  });
}

export async function getProductForAdmin(id: number) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      images: { orderBy: asc(productImages.sortOrder) },
      productAttributes: { orderBy: asc(productAttributes.sortOrder), with: { attribute: true } },
      variants: { with: { variantValues: { with: { attributeValue: true } } } },
    },
  });
}

function toProductRow(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    sku: input.sku,
    categoryId: input.categoryId ? Number(input.categoryId) : null,
    shortDescription: input.shortDescription || null,
    description: input.description || null,
    specifications: input.specifications ? parseKeyValueLines(input.specifications) : null,
    sizeChart: input.sizeChart ? parseKeyValueLines(input.sizeChart) : null,
    regularPrice: input.regularPrice.toFixed(2),
    salePrice: input.salePrice ? Number(input.salePrice).toFixed(2) : null,
    stockQuantity: input.stockQuantity,
    stockStatus: input.stockStatus,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
  };
}

export async function createProduct(input: ProductInput, badges: { isFeatured: boolean; isBestSeller: boolean; isActive: boolean }) {
  const [product] = await db
    .insert(products)
    .values({ ...toProductRow(input), ...badges })
    .returning();
  return product;
}

export async function updateProduct(id: number, input: ProductInput, badges: { isFeatured: boolean; isBestSeller: boolean; isActive: boolean }) {
  const [product] = await db
    .update(products)
    .set({ ...toProductRow(input), ...badges, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return product;
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

export async function addProductImage(productId: number, storageKey: string, isPrimary: boolean, sortOrder: number) {
  await db.insert(productImages).values({ productId, storageKey, isPrimary, sortOrder });
}

export async function getProductImage(imageId: number) {
  return db.query.productImages.findFirst({ where: eq(productImages.id, imageId) });
}

export async function deleteProductImage(imageId: number) {
  await db.delete(productImages).where(eq(productImages.id, imageId));
}

export type VariantRowInput = {
  sku: string;
  priceOverride: number | null;
  stockQuantity: number;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
  valueIds: number[];
};

export async function replaceProductVariants(
  productId: number,
  attributeIds: number[],
  variantRows: VariantRowInput[],
) {
  await db.transaction(async (tx) => {
    await tx.delete(productVariants).where(eq(productVariants.productId, productId));
    await tx.delete(productAttributes).where(eq(productAttributes.productId, productId));

    if (attributeIds.length > 0) {
      await tx.insert(productAttributes).values(
        attributeIds.map((attributeId, i) => ({ productId, attributeId, sortOrder: i })),
      );
    }

    for (const row of variantRows) {
      const [variant] = await tx
        .insert(productVariants)
        .values({
          productId,
          sku: row.sku,
          priceOverride: row.priceOverride ? row.priceOverride.toFixed(2) : null,
          stockQuantity: row.stockQuantity,
          stockStatus: row.stockStatus,
        })
        .returning();

      if (row.valueIds.length > 0) {
        await tx.insert(productVariantValues).values(
          row.valueIds.map((attributeValueId) => ({ variantId: variant.id, attributeValueId })),
        );
      }
    }
  });
}
