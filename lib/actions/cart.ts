"use server";

import { revalidatePath } from "next/cache";
import { getOrSetCartTokenHash } from "@/lib/cart/session";
import {
  addCartItem,
  getProductForCart,
  getVariantForProduct,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/services/cart";

export type CartActionResult = { success: true } | { success: false; error: string };

export async function addToCartAction({
  productId,
  variantId,
  quantity,
}: {
  productId: number;
  variantId: number | null;
  quantity: number;
}): Promise<CartActionResult> {
  if (quantity < 1) return { success: false, error: "Quantity must be at least 1." };

  const product = await getProductForCart(productId);
  if (!product) return { success: false, error: "Product not found." };

  if (variantId !== null) {
    const variant = await getVariantForProduct(productId, variantId);
    if (!variant) return { success: false, error: "Selected option is unavailable." };
    if (variant.stockStatus === "out_of_stock") {
      return { success: false, error: "This option is out of stock." };
    }
  } else if (product.stockStatus === "out_of_stock") {
    return { success: false, error: "This product is out of stock." };
  }

  const tokenHash = await getOrSetCartTokenHash();
  await addCartItem({ tokenHash, productId, variantId, quantity });
  revalidatePath("/cart");

  return { success: true };
}

export async function updateCartItemAction({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}): Promise<CartActionResult> {
  const tokenHash = await getOrSetCartTokenHash();
  await updateCartItemQuantity({ tokenHash, itemId, quantity });
  revalidatePath("/cart");
  return { success: true };
}

export async function removeCartItemAction({ itemId }: { itemId: number }): Promise<CartActionResult> {
  const tokenHash = await getOrSetCartTokenHash();
  await removeCartItem({ tokenHash, itemId });
  revalidatePath("/cart");
  return { success: true };
}
