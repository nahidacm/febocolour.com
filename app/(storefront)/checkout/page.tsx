import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { pageMetadata } from "@/lib/seo/metadata";
import { getActivePaymentMethods, getActiveShippingMethods } from "@/lib/services/shipping";
import { readCartTokenHash } from "@/lib/cart/session";
import { getCartSummary } from "@/lib/services/cart";

export const metadata = pageMetadata({
  title: "Checkout",
  path: "/checkout",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const tokenHash = await readCartTokenHash();
  const cart = await getCartSummary(tokenHash);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">Checkout</h1>
      <div className="mt-8">
        {cart.items.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="font-display text-2xl font-semibold text-foreground">Your cart is empty</h2>
            <p className="mt-2 text-sm text-foreground/60">
              Add something to your cart before checking out.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-brand-lg bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <CheckoutPageForm />
        )}
      </div>
    </div>
  );
}

async function CheckoutPageForm() {
  const [shippingMethods, paymentMethods] = await Promise.all([
    getActiveShippingMethods(),
    getActivePaymentMethods(),
  ]);

  return <CheckoutForm shippingMethods={shippingMethods} paymentMethods={paymentMethods} />;
}
