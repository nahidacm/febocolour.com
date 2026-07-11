import { readCartTokenHash } from "@/lib/cart/session";
import { getCartSummary } from "@/lib/services/cart";

export async function GET() {
  const tokenHash = await readCartTokenHash();
  const cart = await getCartSummary(tokenHash);

  return Response.json({ itemCount: cart.itemCount, subtotal: cart.subtotal, items: cart.items });
}
