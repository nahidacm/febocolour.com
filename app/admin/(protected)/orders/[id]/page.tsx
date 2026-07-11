import { notFound } from "next/navigation";
import { OrderStatusForm } from "@/components/admin/orders/OrderStatusForm";
import { getOrderForAdmin } from "@/lib/services/orders";

export const dynamic = "force-dynamic";

function formatTaka(amount: string | number) {
  return `৳${Number(amount).toLocaleString("en-US")}`;
}

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderForAdmin(Number(id));
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-foreground">{order.orderNumber}</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Placed {new Date(order.placedAt).toLocaleString()}
      </p>

      <div className="mt-6 rounded-brand-lg border border-brand-100 bg-white p-6">
        <OrderStatusForm orderId={order.id} orderStatus={order.orderStatus} paymentStatus={order.paymentStatus} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-brand-lg border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Customer</h2>
          <div className="mt-3 space-y-1 text-sm text-foreground/70">
            <p>{order.shippingFullName}</p>
            <p>{order.shippingPhone}</p>
            {order.email ? <p>{order.email}</p> : null}
            <p>
              {order.shippingAddressLine}, {order.shippingCity}
              {order.shippingArea ? `, ${order.shippingArea}` : ""}
              {order.shippingPostalCode ? ` — ${order.shippingPostalCode}` : ""}
            </p>
            {order.notes ? <p className="italic">Note: {order.notes}</p> : null}
          </div>
        </div>

        <div className="rounded-brand-lg border border-brand-100 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Fulfillment</h2>
          <div className="mt-3 space-y-1 text-sm text-foreground/70">
            <p>
              <span className="font-medium text-foreground">Shipping:</span> {order.shippingMethod.name} (
              {formatTaka(order.shippingCost)})
            </p>
            <p>
              <span className="font-medium text-foreground">Payment:</span> {order.paymentMethod.name}
            </p>
            {order.paymentDetails.map((pd) => (
              <p key={pd.id}>
                <span className="font-medium text-foreground">Transaction:</span>{" "}
                {pd.transactionId ?? "—"} {pd.senderNumber ? `(from ${pd.senderNumber})` : ""}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-brand-lg border border-brand-100 bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Items</h2>
        <ul className="mt-3 space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground/80">
                {item.productNameSnapshot}
                {item.variantLabelSnapshot ? ` (${item.variantLabelSnapshot})` : ""} &times; {item.quantity}
                <span className="ml-2 text-xs text-foreground/40">{item.skuSnapshot}</span>
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
            <span className="text-foreground/70">Shipping</span>
            <span>{formatTaka(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-brand-700">
            <span>Total</span>
            <span>{formatTaka(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
