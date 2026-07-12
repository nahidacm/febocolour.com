import { db } from "@/lib/db/client";

export async function listInventoryForAdmin() {
  const rows = await db.query.products.findMany({
    with: { variants: true },
  });

  const flattened = rows.flatMap((product) => {
    if (product.variants.length === 0) {
      return [
        {
          key: `p-${product.id}`,
          productId: product.id,
          productName: product.name,
          variantLabel: null as string | null,
          sku: product.sku,
          stockQuantity: product.stockQuantity,
          stockStatus: product.stockStatus,
        },
      ];
    }
    return product.variants.map((variant) => ({
      key: `v-${variant.id}`,
      productId: product.id,
      productName: product.name,
      variantLabel: variant.sku,
      sku: variant.sku,
      stockQuantity: variant.stockQuantity,
      stockStatus: variant.stockStatus,
    }));
  });

  return flattened.sort((a, b) => a.stockQuantity - b.stockQuantity);
}
