import "server-only";
import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/auth/admin";
import { getCurrentCustomer } from "@/lib/auth/customer";

export async function requireAdmin() {
  const admin = await getCurrentAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireCustomer() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");
  return customer;
}
