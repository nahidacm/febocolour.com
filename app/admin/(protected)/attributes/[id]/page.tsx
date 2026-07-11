import { notFound } from "next/navigation";
import { AttributeForm } from "@/components/admin/attributes/AttributeForm";
import { getAttributeForAdmin } from "@/lib/services/admin/attributes";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditAttributePage({ params }: PageProps) {
  const { id } = await params;
  const attribute = await getAttributeForAdmin(Number(id));
  if (!attribute) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">{attribute.name}</h1>
      <div className="mt-6">
        <AttributeForm attribute={attribute} />
      </div>
    </div>
  );
}
