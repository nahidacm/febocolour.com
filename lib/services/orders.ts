import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orders } from "@/lib/db/schema";
import type { orderStatusEnum, paymentStatusEnum } from "@/lib/db/schema";

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

export async function getOrderForAdmin(id: number) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
      shippingMethod: true,
      paymentMethod: true,
      paymentDetails: true,
    },
  });
}

export async function updateOrderStatus(
  id: number,
  status: {
    orderStatus: (typeof orderStatusEnum.enumValues)[number];
    paymentStatus: (typeof paymentStatusEnum.enumValues)[number];
  },
) {
  const [order] = await db
    .update(orders)
    .set({ ...status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();
  return order;
}
