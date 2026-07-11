import { ProductForm } from "@/components/admin/products/ProductForm";
import { listCategoriesForSelect } from "@/lib/services/admin/categories";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await listCategoriesForSelect();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-foreground">New Product</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Save the product first — images and variants can be added after.
      </p>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
