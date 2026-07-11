import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { listCategoriesForSelect } from "@/lib/services/admin/categories";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const parentOptions = (await listCategoriesForSelect()).filter((c) => !c.parentId);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">New Category</h1>
      <div className="mt-6">
        <CategoryForm parentOptions={parentOptions} />
      </div>
    </div>
  );
}
