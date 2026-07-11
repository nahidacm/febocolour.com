import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { attributeValues, attributes } from "@/lib/db/schema";
import type { AttributeInput, AttributeValueInput } from "@/lib/validation/admin/attribute";

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

export async function createAttribute(input: AttributeInput, values: AttributeValueInput[]) {
  return db.transaction(async (tx) => {
    const [attribute] = await tx.insert(attributes).values(input).returning();
    if (values.length > 0) {
      await tx.insert(attributeValues).values(
        values.map((v, i) => ({
          attributeId: attribute.id,
          value: v.value,
          slug: v.slug,
          swatchHex: v.swatchHex || null,
          sortOrder: i,
        })),
      );
    }
    return attribute;
  });
}

export async function updateAttribute(id: number, input: AttributeInput, values: AttributeValueInput[]) {
  return db.transaction(async (tx) => {
    const [attribute] = await tx
      .update(attributes)
      .set(input)
      .where(eq(attributes.id, id))
      .returning();

    // Replace-all is simplest and safe: attribute_values → product_variant_values
    // cascades on delete, so removing a value just detaches it from any variants
    // that used it (an accepted trade-off of editing global attributes directly).
    await tx.delete(attributeValues).where(eq(attributeValues.attributeId, id));
    if (values.length > 0) {
      await tx.insert(attributeValues).values(
        values.map((v, i) => ({
          attributeId: id,
          value: v.value,
          slug: v.slug,
          swatchHex: v.swatchHex || null,
          sortOrder: i,
        })),
      );
    }
    return attribute;
  });
}

export async function deleteAttribute(id: number) {
  await db.delete(attributes).where(eq(attributes.id, id));
}
