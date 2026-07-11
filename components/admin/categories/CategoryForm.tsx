"use client";

import { useActionState } from "react";
import { FormField, FormTextarea, FormSelect } from "@/components/admin/FormField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveCategoryAction, type CategoryFormState } from "@/lib/actions/admin/categories";

const initialState: CategoryFormState = {};

export function CategoryForm({
  category,
  parentOptions,
}: {
  category?: {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    description: string | null;
    sortOrder: number;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  parentOptions: { id: number; name: string }[];
}) {
  const [state, formAction] = useActionState(saveCategoryAction, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" name="name" defaultValue={category?.name} required error={state.fieldErrors?.name} />
        <FormField label="Slug" name="slug" defaultValue={category?.slug} required error={state.fieldErrors?.slug} />
      </div>

      <FormSelect
        label="Parent Category"
        name="parentId"
        defaultValue={category?.parentId?.toString() ?? ""}
        options={[
          { value: "", label: "— None (top-level) —" },
          ...parentOptions
            .filter((p) => p.id !== category?.id)
            .map((p) => ({ value: p.id.toString(), label: p.name })),
        ]}
      />

      <FormTextarea label="Description" name="description" defaultValue={category?.description ?? ""} />

      <FormField
        label="Sort Order"
        name="sortOrder"
        type="number"
        defaultValue={category?.sortOrder ?? 0}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="SEO Title" name="seoTitle" defaultValue={category?.seoTitle ?? ""} />
        <FormField label="SEO Description" name="seoDescription" defaultValue={category?.seoDescription ?? ""} />
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>{category ? "Save Changes" : "Create Category"}</SubmitButton>
    </form>
  );
}
