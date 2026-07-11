"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Minus, Plus, Truck, X } from "lucide-react";
import { useCart } from "@/components/storefront/CartProvider";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";
import { removeCartItemAction, updateCartItemAction } from "@/lib/actions/cart";
import { cn } from "@/lib/cn";

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString("en-US")}`;
}

export function CartPageView({
  shippingMethods,
}: {
  shippingMethods: { code: string; name: string; description: string | null; rateType: string; flatRate: string | null }[];
}) {
  const { items, subtotal, loading, refresh } = useCart();
  const [isPending, startTransition] = useTransition();

  function changeQuantity(itemId: number, quantity: number) {
    startTransition(async () => {
      await updateCartItemAction({ itemId, quantity });
      await refresh();
    });
  }

  function removeItem(itemId: number) {
    startTransition(async () => {
      await removeCartItemAction({ itemId });
      await refresh();
    });
  }

  // The parent page already confirmed server-side that the cart is non-empty before
  // rendering this component, so `loading` here just means "client-side re-fetch of
  // data we already know exists" — show a skeleton, never the empty-cart message
  // (that would flash-and-collapse the page, which is exactly the CLS bug we're avoiding).
  if (!loading && items.length === 0) {
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">Your Cart</h1>

      {loading ? (
        <div className="mt-8 animate-pulse space-y-4" aria-hidden="true">
          <div className="h-24 rounded-brand-lg bg-brand-50" />
          <div className="h-24 rounded-brand-lg bg-brand-50" />
        </div>
      ) : (
      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <ul className={cn("space-y-4 lg:col-span-2", isPending && "opacity-60")}>
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-brand-lg border border-brand-100 bg-white p-4"
            >
              <Link href={`/product/${item.productSlug}`} className="shrink-0">
                <PlaceholderImage className="h-24 w-24 rounded-brand-md" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="text-sm font-medium text-foreground/90 hover:text-brand-700"
                    >
                      {item.productName}
                    </Link>
                    {item.variantLabel ? (
                      <p className="mt-0.5 text-xs text-foreground/60">{item.variantLabel}</p>
                    ) : null}
                    {item.stockStatus === "out_of_stock" ? (
                      <p className="mt-1 text-xs font-medium text-red-600">Out of stock</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.productName}`}
                    onClick={() => removeItem(item.id)}
                    className="text-foreground/40 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-200 text-foreground/70 hover:bg-brand-50"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-200 text-foreground/70 hover:bg-brand-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-brand-700">
                    {formatTaka(item.lineTotal)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-brand-lg border border-brand-100 bg-brand-50/50 p-6">
          <h2 className="font-display text-lg font-semibold text-foreground">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-foreground/70">Subtotal</span>
            <span className="font-medium text-foreground">{formatTaka(subtotal)}</span>
          </div>

          <div className="mt-4 border-t border-brand-100 pt-4">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-foreground/60 uppercase">
              <Truck className="h-3.5 w-3.5" /> Shipping Estimate
            </p>
            <ul className="mt-2 space-y-1.5">
              {shippingMethods.map((method) => (
                <li key={method.code} className="flex justify-between text-xs text-foreground/60">
                  <span>{method.name}</span>
                  <span>
                    {method.rateType === "free" || Number(method.flatRate ?? 0) === 0
                      ? "Free"
                      : formatTaka(Number(method.flatRate))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-brand-lg bg-brand-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-brand-200 transition-colors hover:bg-brand-700"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/"
            className="mt-3 block text-center text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
      )}
    </div>
  );
}
