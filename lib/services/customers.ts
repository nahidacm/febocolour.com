import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { addresses, carts, customers, orders } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";

export async function findCustomerByEmail(email: string) {
  return db.query.customers.findFirst({ where: eq(customers.email, email) });
}

export async function registerCustomer({
  fullName,
  email,
  phone,
  password,
}: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  const passwordHash = await hashPassword(password);
  const [customer] = await db.insert(customers).values({ fullName, email, phone, passwordHash }).returning();
  return customer;
}

export async function linkCartToCustomer(cartTokenHash: string, customerId: number) {
  await db
    .update(carts)
    .set({ customerId })
    .where(eq(carts.cartTokenHash, cartTokenHash));
}

export async function getCustomerOrders(customerId: number) {
  return db.query.orders.findMany({
    where: eq(orders.customerId, customerId),
    orderBy: desc(orders.createdAt),
    with: { items: true },
  });
}

export async function getCustomerAddresses(customerId: number) {
  return db.query.addresses.findMany({
    where: eq(addresses.customerId, customerId),
    orderBy: desc(addresses.isDefault),
  });
}

export async function updateCustomerProfile(customerId: number, data: { fullName: string; phone: string }) {
  const [customer] = await db
    .update(customers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(customers.id, customerId))
    .returning();
  return customer;
}

export async function createAddress(
  customerId: number,
  data: {
    label?: string;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    area?: string;
    postalCode?: string;
    isDefault?: boolean;
  },
) {
  const [address] = await db
    .insert(addresses)
    .values({ customerId, ...data })
    .returning();
  return address;
}

export async function deleteAddress(customerId: number, addressId: number) {
  await db
    .delete(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.customerId, customerId)));
}
