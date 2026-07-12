import Link from "next/link";
import { Plus } from "lucide-react";
import { Table, Th, Td } from "@/components/admin/Table";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { listAttributesWithValues } from "@/lib/services/admin/attributes";
import { deleteAttributeAction } from "@/lib/actions/admin/attributes";

export const dynamic = "force-dynamic";

export default async function AdminAttributesPage() {
  const items = await listAttributesWithValues();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Attributes ({items.length})
        </h1>
        <Link
          href="/admin/attributes/new"
          className="flex items-center gap-1.5 rounded-brand-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          New Attribute
        </Link>
      </div>

      <div className="mt-6">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Values</Th>
              <Th>
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {items.map((attr) => (
              <tr key={attr.id}>
                <Td>
                  <Link
                    href={`/admin/attributes/${attr.id}`}
                    className="font-medium hover:text-brand-700"
                  >
                    {attr.name}
                  </Link>
                </Td>
                <Td className="text-foreground/60">
                  {attr.inputType === "color_swatch"
                    ? "Color Swatch"
                    : "Select"}
                </Td>
                <Td className="text-foreground/60">
                  {attr.values.map((v) => v.value).join(", ")}
                </Td>
                <Td className="text-right">
                  <DeleteButton
                    action={deleteAttributeAction.bind(null, attr.id)}
                    confirmText={`Delete "${attr.name}"? This removes it from any products using it.`}
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
