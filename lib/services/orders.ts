import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";

export async function getOrderByNumber(orderNumber: string) {
  return db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber),
    with: {
      items: true,
      shippingMethod: true,
      paymentMethod: true,
    },
  });
}

export async function getAllOrders() {
  return db.query.orders.findMany({
    orderBy: desc(orders.createdAt),
    with: {
      items: true,
      shippingMethod: true,
      paymentMethod: true,
    },
  });
}
