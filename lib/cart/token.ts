import { randomBytes, createHash } from "node:crypto";

export const CART_COOKIE_NAME = "fc_cart";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function generateCartToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashCartToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
