"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession, destroyAdminSession } from "@/lib/auth/admin";
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

  const valid = await verifyPassword(admin.passwordHash, parsed.data.password);
  if (!valid) return { error: "Invalid email or password." };

  await createAdminSession(admin.id);
  redirect("/admin");
}

export async function adminLogoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
