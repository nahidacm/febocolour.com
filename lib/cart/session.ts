import { cookies } from "next/headers";
import { CART_COOKIE_MAX_AGE, CART_COOKIE_NAME, generateCartToken, hashCartToken } from "@/lib/cart/token";

/** Read-only: safe to call from Server Components and GET Route Handlers. */
export async function readCartTokenHash(): Promise<string | undefined> {
  const store = await cookies();
  const token = store.get(CART_COOKIE_NAME)?.value;
  return token ? hashCartToken(token) : undefined;
}

/** Mutating: only callable from Server Actions and Route Handlers that can set cookies. */
export async function getOrSetCartTokenHash(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE_NAME)?.value;
  if (existing) return hashCartToken(existing);

  const token = generateCartToken();
  store.set(CART_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });
  return hashCartToken(token);
}
