"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { customers } from "@/lib/db/schema";
import { loginSchema, registerSchema } from "@/lib/validation/auth";
import { findCustomerByEmail, registerCustomer, linkCartToCustomer } from "@/lib/services/customers";
import { verifyPassword } from "@/lib/auth/password";
import { createCustomerSession, destroyCustomerSession } from "@/lib/auth/customer";
import { isLockedOut, nextLockoutState, LOCKOUT_MESSAGE } from "@/lib/auth/lockout";
import { readCartTokenHash } from "@/lib/cart/session";

export type CustomerAuthState = { error?: string; fieldErrors?: Record<string, string> };

export async function customerRegisterAction(
  _prevState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const existing = await findCustomerByEmail(parsed.data.email);
  if (existing) {
    return { error: "An account with that email already exists.", fieldErrors: { email: "Already registered" } };
  }

  const customer = await registerCustomer(parsed.data);
  await createCustomerSession(customer.id);

  const cartTokenHash = await readCartTokenHash();
  if (cartTokenHash) await linkCartToCustomer(cartTokenHash, customer.id);

  redirect("/account");
}

export async function customerLoginAction(
  _prevState: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const customer = await findCustomerByEmail(parsed.data.email);
  if (!customer || !customer.passwordHash) return { error: "Invalid email or password." };

  if (isLockedOut(customer.lockedUntil)) return { error: LOCKOUT_MESSAGE };

  const valid = await verifyPassword(customer.passwordHash, parsed.data.password);
  if (!valid) {
    const { failedLoginAttempts, lockedUntil } = nextLockoutState(customer.failedLoginAttempts);
    await db.update(customers).set({ failedLoginAttempts, lockedUntil }).where(eq(customers.id, customer.id));
    return { error: lockedUntil ? LOCKOUT_MESSAGE : "Invalid email or password." };
  }

  if (customer.failedLoginAttempts > 0) {
    await db.update(customers).set({ failedLoginAttempts: 0, lockedUntil: null }).where(eq(customers.id, customer.id));
  }

  await createCustomerSession(customer.id);

  const cartTokenHash = await readCartTokenHash();
  if (cartTokenHash) await linkCartToCustomer(cartTokenHash, customer.id);

  redirect("/account");
}

export async function customerLogoutAction() {
  await destroyCustomerSession();
  redirect("/account/login");
}
