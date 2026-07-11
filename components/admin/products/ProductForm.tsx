"use client";

import { useActionState } from "react";
import { FormField, FormTextarea, FormSelect, FormCheckbox } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveProductAction, type ProductFormState } from "@/lib/actions/admin/products";
import { formatKeyValueLines } from "@/lib/utils/kv-text";

const initialState: ProductFormState = {};

export type ProductFormProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  categoryId: number | null;
  shortDescription: string | null;
  description: string | null;
  specifications: Record<string, string> | null;
  sizeChart: Record<string, string> | Record<string, string> | null;
  regularPrice: string;
  salePrice: string | null;
  stockQuantity: number;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
  isFeatured: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductFormProduct;
  categories: { id: number; name: string; parentId: number | null }[];
}) {
  const [state, formAction] = useActionState(saveProductAction, initialState);

  return (
    <form action={formAction} className="space-y-8">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <section className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" name="name" defaultValue={product?.name} required error={state.fieldErrors?.name} />
        <FormField label="Slug" name="slug" defaultValue={product?.slug} required error={state.fieldErrors?.slug} />
        <FormField label="SKU" name="sku" defaultValue={product?.sku} required error={state.fieldErrors?.sku} />
        <FormSelect
          label="Category"
          name="categoryId"
          defaultValue={product?.categoryId?.toString() ?? ""}
          options={[
            { value: "", label: "— None —" },
            ...categories.map((c) => ({
              value: c.id.toString(),
              label: c.parentId ? `— ${c.name}` : c.name,
            })),
          ]}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Regular Price (৳)"
          name="regularPrice"
          type="number"
          step="0.01"
          defaultValue={product?.regularPrice}
          required
          error={state.fieldErrors?.regularPrice}
        />
        <FormField
          label="Sale Price (৳, optional)"
          name="salePrice"
          type="number"
          step="0.01"
          defaultValue={product?.salePrice ?? ""}
          error={state.fieldErrors?.salePrice}
        />
        <FormField
          label="Stock Quantity"
          name="stockQuantity"
          type="number"
          defaultValue={product?.stockQuantity ?? 0}
          required
          error={state.fieldErrors?.stockQuantity}
        />
        <FormSelect
          label="Stock Status"
          name="stockStatus"
          defaultValue={product?.stockStatus ?? "in_stock"}
          options={[
            { value: "in_stock", label: "In Stock" },
            { value: "out_of_stock", label: "Out of Stock" },
            { value: "backorder", label: "Backorder" },
          ]}
        />
      </section>

      <section className="flex flex-wrap gap-6">
        <FormCheckbox label="Featured" name="isFeatured" defaultChecked={product?.isFeatured} />
        <FormCheckbox label="Best Seller" name="isBestSeller" defaultChecked={product?.isBestSeller} />
        <FormCheckbox label="Active (visible on storefront)" name="isActive" defaultChecked={product?.isActive ?? true} />
      </section>

      <section className="space-y-4">
        <FormField
          label="Short Description"
          name="shortDescription"
          defaultValue={product?.shortDescription ?? ""}
        />
        <FormTextarea label="Description" name="description" defaultValue={product?.description ?? ""} rows={5} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <FormTextarea
          label="Specifications (one per line, Key: Value)"
          name="specifications"
          defaultValue={formatKeyValueLines(product?.specifications)}
          rows={5}
        />
        <FormTextarea
          label="Size Chart (one per line, Key: Value)"
          name="sizeChart"
          defaultValue={formatKeyValueLines(product?.sizeChart)}
          rows={5}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <FormField label="SEO Title" name="seoTitle" defaultValue={product?.seoTitle ?? ""} />
        <FormField label="SEO Description" name="seoDescription" defaultValue={product?.seoDescription ?? ""} />
      </section>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>{product ? "Save Changes" : "Create Product"}</SubmitButton>
    </form>
  );
}
