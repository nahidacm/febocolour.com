import { notFound } from "next/navigation";
import { getCurrentCustomer } from "@/lib/auth/customer";
import { getOrderByNumber } from "@/lib/services/orders";

function formatTaka(amount: string | number) {
  return `৳${Number(amount).toLocaleString("en-US")}`;
}

type PageProps = { params: Promise<{ orderNumber: string }> };

export default async function AccountOrderDetailPage({ params }: PageProps) {
  const { orderNumber } = await params;
  const customer = await getCurrentCustomer();
  const order = await getOrderByNumber(orderNumber);

  // Ownership check — customers can only view their own orders, even by guessing a URL.
  if (!order || !customer || order.customerId !== customer.id) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">{order.orderNumber}</h1>
      <p className="mt-1 text-sm text-foreground/60">Placed {new Date(order.placedAt).toLocaleDateString()}</p>

      <div className="mt-6 rounded-brand-lg border border-brand-100 bg-white p-6">
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground/80">
                {item.productNameSnapshot}
                {item.variantLabelSnapshot ? ` (${item.variantLabelSnapshot})` : ""} &times; {item.quantity}
              </span>
              <span className="font-medium">{formatTaka(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-brand-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/70">Subtotal</span>
            <span>{formatTaka(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">Shipping ({order.shippingMethod.name})</span>
            <span>{formatTaka(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-brand-700">
            <span>Total</span>
            <span>{formatTaka(order.total)}</span>
          </div>
        </div>
        <p className="mt-4 border-t border-brand-100 pt-4 text-sm text-foreground/70">
          <span className="font-medium text-foreground">Status:</span>{" "}
          <span className="capitalize">{order.orderStatus}</span>
          <br />
          <span className="font-medium text-foreground">Delivering to:</span> {order.shippingAddressLine},{" "}
          {order.shippingCity}
        </p>
      </div>
    </div>
  );
}
