import "server-only";
import { cookies, headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { adminSessions } from "@/lib/db/schema";
import { generateSessionToken, hashSessionToken } from "@/lib/auth/token";

const ADMIN_COOKIE_NAME = "fc_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function createAdminSession(adminUserId: number) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const headerList = await headers();

  await db.insert(adminSessions).values({
    adminUserId,
    tokenHash,
    userAgent: headerList.get("user-agent")?.slice(0, 255),
    ip: headerList.get("x-forwarded-for")?.split(",")[0]?.trim(),
    expiresAt: new Date(Date.now() + ADMIN_SESSION_MAX_AGE * 1000),
  });

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getCurrentAdminUser() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const session = await db.query.adminSessions.findFirst({
    where: eq(adminSessions.tokenHash, tokenHash),
    with: { adminUser: true },
  });

  if (!session || session.expiresAt < new Date() || !session.adminUser.isActive) return null;
  return session.adminUser;
}

export async function destroyAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashSessionToken(token)));
  }
  store.delete(ADMIN_COOKIE_NAME);
}
