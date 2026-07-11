"use client";

import { useEffect } from "react";
import { useCart } from "@/components/storefront/CartProvider";

/** Placed on pages that change server-side cart state via a redirect (e.g. order
 *  confirmation) — the CartProvider lives above the redirect target and won't
 *  otherwise know its stale client-side count needs re-fetching. */
export function CartRefreshOnMount() {
  const { refresh } = useCart();

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
