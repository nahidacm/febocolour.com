import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { orderPaymentDetails, orders } from "@/lib/db/schema";
import type { orderStatusEnum, paymentStatusEnum } from "@/lib/db/schema";
import { createSteadfastOrder, getSteadfastStatus, type SteadfastResult } from "@/lib/services/steadfast";

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

/** Pushes a confirmed order to Steadfast for delivery. COD amount is the full
 *  order total for Cash on Delivery orders, 0 for everything else (the customer
 *  already paid, or is expected to have paid, before dispatch). */
export async function sendOrderToSteadfast(orderId: number): Promise<SteadfastResult<{ trackingCode: string }>> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { paymentMethod: true },
  });
  if (!order) return { success: false, error: "Order not found." };
  if (order.courierConsignmentId) {
    return { success: false, error: "This order has already been sent to Steadfast." };
  }

  const codAmount = order.paymentMethod.code === "cod" ? Number(order.total) : 0;

  const result = await createSteadfastOrder({
    invoice: order.orderNumber,
    recipientName: order.shippingFullName,
    recipientPhone: order.shippingPhone,
    recipientAddress: [order.shippingAddressLine, order.shippingArea, order.shippingCity]
      .filter(Boolean)
      .join(", "),
    codAmount,
  });
  if (!result.success) return result;

  await db
    .update(orders)
    .set({
      courierConsignmentId: result.data.consignmentId,
      courierTrackingCode: result.data.trackingCode,
      courierTrackingLink: result.data.trackingLink,
      courierStatus: result.data.status,
      courierSentAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  return { success: true, data: { trackingCode: result.data.trackingCode } };
}

/** Pulls the latest delivery status from Steadfast for an order already sent to them. */
export async function refreshSteadfastStatus(orderId: number): Promise<SteadfastResult<{ status: string }>> {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
  if (!order?.courierConsignmentId) {
    return { success: false, error: "This order hasn't been sent to Steadfast yet." };
  }

  const result = await getSteadfastStatus(order.courierConsignmentId);
  if (!result.success) return result;

  await db
    .update(orders)
    .set({ courierStatus: result.data.status, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  return { success: true, data: { status: result.data.status } };
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
