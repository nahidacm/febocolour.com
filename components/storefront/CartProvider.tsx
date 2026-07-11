"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: number;
  productId: number;
  productSlug: string;
  productName: string;
  variantId: number | null;
  variantLabel: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
  stockAvailable: number;
};

type CartState = {
  itemCount: number;
  subtotal: number;
  items: CartItem[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      setItemCount(data.itemCount ?? 0);
      setSubtotal(data.subtotal ?? 0);
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CartContext.Provider value={{ itemCount, subtotal, items, loading, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
