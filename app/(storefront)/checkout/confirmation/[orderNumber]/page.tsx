import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getOrderByNumber } from "@/lib/services/orders";
import { pageMetadata } from "@/lib/seo/metadata";
import { CartRefreshOnMount } from "@/components/storefront/CartRefreshOnMount";

export const metadata = pageMetadata({
  title: "Order Confirmed",
  path: "/checkout/confirmation",
  noIndex: true,
});

export const dynamic = "force-dynamic";

function formatTaka(amount: string | number) {
  return `৳${Number(amount).toLocaleString("en-US")}`;
}

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <CartRefreshOnMount />
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Thank you, {order.shippingFullName}!
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Your order <span className="font-semibold text-brand-700">{order.orderNumber}</span> has
          been placed. We&apos;ll contact you shortly to confirm delivery.
        </p>
      </div>

      <div className="mt-8 rounded-brand-lg border border-brand-100 bg-white p-6">
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span className="text-foreground/80">
                {item.productNameSnapshot}
                {item.variantLabelSnapshot ? ` (${item.variantLabelSnapshot})` : ""} &times;{" "}
                {item.quantity}
              </span>
              <span className="font-medium">{formatTaka(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1.5 border-t border-brand-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/70">Subtotal</span>
            <span>{formatTaka(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground/70">Shipping ({order.shippingMethod.name})</span>
            <span>{formatTaka(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold text-brand-700">
            <span>Total</span>
            <span>{formatTaka(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-brand-100 pt-4 text-sm text-foreground/70">
          <p>
            <span className="font-medium text-foreground">Payment method:</span>{" "}
            {order.paymentMethod.name}
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Delivering to:</span>{" "}
            {order.shippingAddressLine}, {order.shippingCity}
            {order.shippingArea ? `, ${order.shippingArea}` : ""}
          </p>
          <p className="mt-1">
            <span className="font-medium text-foreground">Phone:</span> {order.shippingPhone}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block rounded-brand-lg bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
