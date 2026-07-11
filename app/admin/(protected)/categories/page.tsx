import Link from "next/link";
import { Plus } from "lucide-react";
import { Table, Th, Td } from "@/components/admin/Table";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listCategoriesForSelect } from "@/lib/services/admin/categories";
import { deleteCategoryAction } from "@/lib/actions/admin/categories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const items = await listCategoriesForSelect();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Categories ({items.length})</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-1.5 rounded-brand-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New Category
        </Link>
      </div>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Slug</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {items.map((category) => (
              <tr key={category.id}>
                <Td>
                  <Link href={`/admin/categories/${category.id}`} className="font-medium hover:text-brand-700">
                    {category.parentId ? <span className="text-foreground/40">— </span> : null}
                    {category.name}
                  </Link>
                </Td>
                <Td className="text-foreground/60">{category.slug}</Td>
                <Td className="text-right">
                  <DeleteButton
                    action={deleteCategoryAction.bind(null, category.id)}
                    confirmText={`Delete "${category.name}"? Products in it will become uncategorized.`}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
