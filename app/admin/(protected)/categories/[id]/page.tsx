import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { getCategoryForAdmin, listCategoriesForSelect } from "@/lib/services/admin/categories";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const [category, allCategories] = await Promise.all([
    getCategoryForAdmin(Number(id)),
    listCategoriesForSelect(),
  ]);

  if (!category) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">{category.name}</h1>
      <div className="mt-6">
        <CategoryForm category={category} parentOptions={allCategories.filter((c) => !c.parentId)} />
      </div>
    </div>
  );
}
