import { notFound } from "next/navigation";
import { PaymentMethodForm } from "@/components/admin/payments/PaymentMethodForm";
import { getPaymentMethodForAdmin } from "@/lib/services/admin/payments";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPaymentMethodPage({ params }: PageProps) {
  const { id } = await params;
  const method = await getPaymentMethodForAdmin(Number(id));
  if (!method) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">{method.name}</h1>
      <div className="mt-6">
        <PaymentMethodForm method={method} />
      </div>
    </div>
  );
}
