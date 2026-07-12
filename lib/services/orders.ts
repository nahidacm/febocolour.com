import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orderPaymentDetails, orders } from "@/lib/db/schema";
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
      paymentDetails: { with: { verifiedByAdmin: true } },
    },
  });
}

export async function verifyOrderPayment(orderPaymentDetailId: number, adminId: number) {
  const [detail] = await db
    .update(orderPaymentDetails)
    .set({ verifiedAt: new Date(), verifiedByAdminId: adminId })
    .where(eq(orderPaymentDetails.id, orderPaymentDetailId))
    .returning();
  if (!detail) return null;

  const [order] = await db
    .update(orders)
    .set({ paymentStatus: "paid", updatedAt: new Date() })
    .where(eq(orders.id, detail.orderId))
    .returning();

  return { detail, order };
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
