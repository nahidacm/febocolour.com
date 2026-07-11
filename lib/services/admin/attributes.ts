import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { attributeValues, attributes } from "@/lib/db/schema";

export async function listAttributesWithValues() {
  return db.query.attributes.findMany({
    orderBy: asc(attributes.sortOrder),
    with: { values: { orderBy: asc(attributeValues.sortOrder) } },
  });
}

export async function getAttributeForAdmin(id: number) {
  return db.query.attributes.findFirst({
    where: eq(attributes.id, id),
    with: { values: { orderBy: asc(attributeValues.sortOrder) } },
  });
}
