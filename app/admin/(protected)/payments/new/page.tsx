import { PaymentMethodForm } from "@/components/admin/payments/PaymentMethodForm";

export default function NewPaymentMethodPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">New Payment Method</h1>
      <div className="mt-6">
        <PaymentMethodForm />
      </div>
    </div>
  );
}
