import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { cartItems, carts, productVariants, products } from "@/lib/db/schema";

export type CartLineItem = {
  id: number;
  productId: number;
  productSlug: string;
  productName: string;
  variantId: number | null;
  variantLabel: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stockStatus: "in_stock" | "out_of_stock" | "backorder";
  stockAvailable: number;
};

export type CartSummary = {
  cartId: number | null;
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
};

const emptyCart: CartSummary = { cartId: null, items: [], itemCount: 0, subtotal: 0 };

export async function findCartIdByTokenHash(tokenHash: string): Promise<number | null> {
  const cart = await db.query.carts.findFirst({
    where: eq(carts.cartTokenHash, tokenHash),
    columns: { id: true },
  });
  return cart?.id ?? null;
}

export async function getOrCreateCartId(tokenHash: string): Promise<number> {
  const existing = await findCartIdByTokenHash(tokenHash);
  if (existing) return existing;

  const [created] = await db.insert(carts).values({ cartTokenHash: tokenHash }).returning({ id: carts.id });
  return created.id;
}

function activePrice(product: { regularPrice: string; salePrice: string | null; saleStartsAt: Date | null; saleEndsAt: Date | null }) {
  if (!product.salePrice) return Number(product.regularPrice);
  const now = new Date();
  if (product.saleStartsAt && now < product.saleStartsAt) return Number(product.regularPrice);
  if (product.saleEndsAt && now > product.saleEndsAt) return Number(product.regularPrice);
  return Number(product.salePrice);
}

export async function getCartSummary(tokenHash: string | undefined): Promise<CartSummary> {
  if (!tokenHash) return emptyCart;

  const cartId = await findCartIdByTokenHash(tokenHash);
  if (!cartId) return emptyCart;

  const rows = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    orderBy: (item, { asc }) => asc(item.createdAt),
    with: {
      product: true,
      variant: { with: { variantValues: { with: { attributeValue: true } } } },
    },
  });

  const items: CartLineItem[] = rows.map((row) => {
    const unitPrice = row.variant?.priceOverride
      ? Number(row.variant.priceOverride)
      : activePrice(row.product);
    const variantLabel = row.variant
      ? row.variant.variantValues.map((vv) => vv.attributeValue.value).join(" / ")
      : null;

    return {
      id: row.id,
      productId: row.productId,
      productSlug: row.product.slug,
      productName: row.product.name,
      variantId: row.variantId,
      variantLabel,
      sku: row.variant?.sku ?? row.product.sku,
      unitPrice,
      quantity: row.quantity,
      lineTotal: unitPrice * row.quantity,
      stockStatus: row.variant?.stockStatus ?? row.product.stockStatus,
      stockAvailable: row.variant?.stockQuantity ?? row.product.stockQuantity,
    };
  });

  return {
    cartId,
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

export async function addCartItem({
  tokenHash,
  productId,
  variantId,
  quantity,
}: {
  tokenHash: string;
  productId: number;
  variantId: number | null;
  quantity: number;
}) {
  const cartId = await getOrCreateCartId(tokenHash);

  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cartId),
      eq(cartItems.productId, productId),
      variantId === null ? isNull(cartItems.variantId) : eq(cartItems.variantId, variantId),
    ),
  });

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId, productId, variantId, quantity });
  }

  return cartId;
}

export async function updateCartItemQuantity({
  tokenHash,
  itemId,
  quantity,
}: {
  tokenHash: string;
  itemId: number;
  quantity: number;
}) {
  const cartId = await findCartIdByTokenHash(tokenHash);
  if (!cartId) return;

  if (quantity <= 0) {
    await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
    return;
  }

  await db
    .update(cartItems)
    .set({ quantity, updatedAt: new Date() })
    .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
}

export async function removeCartItem({ tokenHash, itemId }: { tokenHash: string; itemId: number }) {
  const cartId = await findCartIdByTokenHash(tokenHash);
  if (!cartId) return;

  await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
}

export async function clearCart(cartId: number) {
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}

/** Validates that a variant belongs to the given product and returns its stock info. */
export async function getVariantForProduct(productId: number, variantId: number) {
  return db.query.productVariants.findFirst({
    where: and(eq(productVariants.id, variantId), eq(productVariants.productId, productId)),
  });
}

export async function getProductForCart(productId: number) {
  return db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.isActive, true)),
  });
}
