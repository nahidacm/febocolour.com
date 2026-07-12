import { notFound } from "next/navigation";
import { ShippingMethodForm } from "@/components/admin/shipping/ShippingMethodForm";
import { getShippingMethodForAdmin } from "@/lib/services/admin/shipping";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditShippingMethodPage({ params }: PageProps) {
  const { id } = await params;
  const method = await getShippingMethodForAdmin(Number(id));
  if (!method) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">{method.name}</h1>
      <div className="mt-6">
        <ShippingMethodForm method={method} />
      </div>
    </div>
  );
}
