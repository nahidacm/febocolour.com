import { readCartTokenHash } from "@/lib/cart/session";
import { getCartSummary } from "@/lib/services/cart";

// Per-cookie personalized data — must never be cached by the browser, a CDN, or a
// shared proxy, or one visitor's cart could be served to another.
export const dynamic = "force-dynamic";

export async function GET() {
  const tokenHash = await readCartTokenHash();
  const cart = await getCartSummary(tokenHash);

  return Response.json(
    { itemCount: cart.itemCount, subtotal: cart.subtotal, items: cart.items },
    { headers: { "Cache-Control": "no-store" } },
  );
}
