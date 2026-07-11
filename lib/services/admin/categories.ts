import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import type { CategoryInput } from "@/lib/validation/admin/category";

export async function listCategoriesForAdmin() {
  return db.query.categories.findMany({
    orderBy: asc(categories.sortOrder),
    with: { parent: true },
  });
}

/** Flat list ordered parent-then-children, for building a select dropdown. */
export async function listCategoriesForSelect() {
  const all = await listCategoriesForAdmin();
  const parents = all.filter((c) => !c.parentId);
  const ordered: typeof all = [];
  for (const parent of parents) {
    ordered.push(parent);
    ordered.push(...all.filter((c) => c.parentId === parent.id));
  }
  return ordered;
}

export async function getCategoryForAdmin(id: number) {
  return db.query.categories.findFirst({ where: eq(categories.id, id) });
}

function toCategoryRow(input: CategoryInput) {
  return {
    name: input.name,
    slug: input.slug,
    parentId: input.parentId ? Number(input.parentId) : null,
    description: input.description || null,
    sortOrder: input.sortOrder ?? 0,
    seoTitle: input.seoTitle || null,
    seoDescription: input.seoDescription || null,
  };
}

export async function createCategory(input: CategoryInput) {
  const [category] = await db.insert(categories).values(toCategoryRow(input)).returning();
  return category;
}

export async function updateCategory(id: number, input: CategoryInput) {
  const [category] = await db
    .update(categories)
    .set({ ...toCategoryRow(input), updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();
  return category;
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
}
