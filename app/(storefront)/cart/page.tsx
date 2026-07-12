import Link from "next/link";
import { CartPageView } from "@/components/storefront/CartPageView";
import { pageMetadata } from "@/lib/seo/metadata";
import { getActiveShippingMethods } from "@/lib/services/shipping";
import { readCartTokenHash } from "@/lib/cart/session";
import { getCartSummary } from "@/lib/services/cart";

export const metadata = pageMetadata({
  title: "Your Cart",
  description: "Review the items in your FeboColour cart before checking out.",
  path: "/cart",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const tokenHash = await readCartTokenHash();
  const cart = await getCartSummary(tokenHash);

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Browse our collection and add something you love.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-brand-lg bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shippingMethods = await getActiveShippingMethods();

  return <CartPageView shippingMethods={shippingMethods} />;
}
