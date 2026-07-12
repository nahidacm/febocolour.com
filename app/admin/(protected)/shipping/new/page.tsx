import { ShippingMethodForm } from "@/components/admin/shipping/ShippingMethodForm";

export default function NewShippingMethodPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">New Shipping Method</h1>
      <div className="mt-6">
        <ShippingMethodForm />
      </div>
    </div>
  );
}
