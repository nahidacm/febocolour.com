import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { customers, orders } from "@/lib/db/schema";

export async function listCustomersForAdmin() {
  return db.query.customers.findMany({
    orderBy: desc(customers.createdAt),
    with: { orders: { columns: { id: true, total: true } } },
  });
}

export async function getCustomerForAdmin(id: number) {
  return db.query.customers.findFirst({
    where: eq(customers.id, id),
    with: {
      orders: { orderBy: desc(orders.createdAt) },
      addresses: true,
    },
  });
}
