import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";

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
