"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCart } from "@/components/storefront/CartProvider";
import { removeCartItemAction, updateCartItemAction } from "@/lib/actions/cart";
import { PlaceholderImage } from "@/components/storefront/PlaceholderImage";

function formatTaka(amount: number) {
  return `৳${amount.toLocaleString("en-US")}`;
}

export function CartMenu() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { itemCount, subtotal, items, refresh } = useCart();

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

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mini-cart-panel"
        className="relative flex h-10 w-10 items-center justify-center rounded-brand-md text-foreground/80 transition-colors hover:bg-brand-50 hover:text-brand-700"
      >
        <span className="sr-only">Cart,</span>
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
          {itemCount}
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            id="mini-cart-panel"
            className="absolute top-full right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-brand-lg border border-brand-100 bg-white p-4 shadow-xl"
          >
            {items.length === 0 ? (
              <p className="py-6 text-center text-sm text-foreground/60">Your cart is empty.</p>
            ) : (
              <>
                <ul className={cn("max-h-80 space-y-3 overflow-y-auto", isPending && "opacity-60")}>
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-brand-sm">
                        {item.image ? (
                          <Image
                            src={`/uploads/${item.image}`}
                            alt={item.productName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <PlaceholderImage className="h-full w-full" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground/90">
                          {item.productName}
                        </p>
                        {item.variantLabel ? (
                          <p className="text-xs text-foreground/60">{item.variantLabel}</p>
                        ) : null}
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, item.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200 text-foreground/70 hover:bg-brand-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(item.id, item.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-200 text-foreground/70 hover:bg-brand-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <span className="ml-auto text-xs font-semibold text-brand-700">
                            {formatTaka(item.lineTotal)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.productName}`}
                        onClick={() => removeItem(item.id)}
                        className="h-fit text-foreground/40 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-brand-100 pt-3">
                  <span className="text-sm font-medium text-foreground/70">Subtotal</span>
                  <span className="text-sm font-semibold text-brand-700">{formatTaka(subtotal)}</span>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="rounded-brand-md bg-brand-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setOpen(false)}
                    className="rounded-brand-md border border-brand-200 py-2.5 text-center text-sm font-semibold text-brand-700 hover:bg-brand-50"
                  >
                    View Cart
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
