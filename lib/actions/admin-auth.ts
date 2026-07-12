"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession, destroyAdminSession } from "@/lib/auth/admin";
import { isLockedOut, nextLockoutState, LOCKOUT_MESSAGE } from "@/lib/auth/lockout";
import { loginSchema } from "@/lib/validation/auth";

export type AdminLoginState = { error?: string };

export async function adminLoginAction(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, parsed.data.email),
  });
  if (!admin || !admin.isActive) return { error: "Invalid email or password." };

  if (isLockedOut(admin.lockedUntil)) return { error: LOCKOUT_MESSAGE };

  const valid = await verifyPassword(admin.passwordHash, parsed.data.password);
  if (!valid) {
    const { failedLoginAttempts, lockedUntil } = nextLockoutState(admin.failedLoginAttempts);
    await db.update(adminUsers).set({ failedLoginAttempts, lockedUntil }).where(eq(adminUsers.id, admin.id));
    return { error: lockedUntil ? LOCKOUT_MESSAGE : "Invalid email or password." };
  }

  if (admin.failedLoginAttempts > 0) {
    await db.update(adminUsers).set({ failedLoginAttempts: 0, lockedUntil: null }).where(eq(adminUsers.id, admin.id));
  }

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
