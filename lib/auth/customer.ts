import "server-only";
import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { customerSessions } from "@/lib/db/schema";
import { generateSessionToken, hashSessionToken } from "@/lib/auth/token";

const CUSTOMER_COOKIE_NAME = "fc_customer_session";
const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function createCustomerSession(customerId: number) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const headerList = await headers();

  await db.insert(customerSessions).values({
    customerId,
    tokenHash,
    userAgent: headerList.get("user-agent")?.slice(0, 255),
    ip: headerList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    expiresAt: new Date(Date.now() + CUSTOMER_SESSION_MAX_AGE * 1000),
  });

  const store = await cookies();
  store.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: CUSTOMER_SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getCurrentCustomer() {
  const store = await cookies();
  const token = store.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const session = await db.query.customerSessions.findFirst({
    where: eq(customerSessions.tokenHash, tokenHash),
    with: { customer: true },
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session.customer;
}

export async function destroyCustomerSession() {
  const store = await cookies();
  const token = store.get(CUSTOMER_COOKIE_NAME)?.value;
  if (token) {
    await db.delete(customerSessions).where(eq(customerSessions.tokenHash, hashSessionToken(token)));
  }
  store.delete(CUSTOMER_COOKIE_NAME);
}
