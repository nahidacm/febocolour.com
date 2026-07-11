import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ImageManager } from "@/components/admin/products/ImageManager";
import { VariantBuilder } from "@/components/admin/products/VariantBuilder";
import { getProductForAdmin } from "@/lib/services/admin/products";
import { listCategoriesForSelect } from "@/lib/services/admin/categories";
import { listAttributesWithValues } from "@/lib/services/admin/attributes";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);
  const [product, categories, allAttributes] = await Promise.all([
    getProductForAdmin(productId),
    listCategoriesForSelect(),
    listAttributesWithValues(),
  ]);

  if (!product) notFound();

  const initialSelectedAttributeIds = product.productAttributes.map((pa) => pa.attributeId);
  const initialVariants = product.variants.map((variant) => ({
    sku: variant.sku,
    priceOverride: variant.priceOverride ? Number(variant.priceOverride) : null,
    stockQuantity: variant.stockQuantity,
    stockStatus: variant.stockStatus,
    valueIds: variant.variantValues.map((vv) => vv.attributeValueId),
  }));

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">{product.name}</h1>
        <p className="mt-1 text-sm text-foreground/60">SKU: {product.sku}</p>
      </div>

      <ProductForm product={product} categories={categories} />

      <div className="border-t border-brand-100 pt-8">
        <ImageManager productId={product.id} images={product.images} />
      </div>

      <div className="border-t border-brand-100 pt-8">
        <VariantBuilder
          productId={product.id}
          productSku={product.sku}
          allAttributes={allAttributes}
          initialSelectedAttributeIds={initialSelectedAttributeIds}
          initialVariants={initialVariants}
        />
      </div>
    </div>
  );
}
