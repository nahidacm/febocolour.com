"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { writeAuditLog } from "@/lib/audit";
import { orderStatusUpdateSchema } from "@/lib/validation/admin/order";
import {
  getOrderForAdmin,
  refreshSteadfastStatus,
  sendOrderToSteadfast,
  updateOrderStatus,
  verifyOrderPayment,
} from "@/lib/services/orders";

export type OrderStatusFormState = { error?: string; success?: boolean };

export async function updateOrderStatusAction(
  _prevState: OrderStatusFormState,
  formData: FormData,
): Promise<OrderStatusFormState> {
  const admin = await requireAdmin();
  const id = Number(formData.get("id"));

  const parsed = orderStatusUpdateSchema.safeParse({
    orderStatus: formData.get("orderStatus")?.toString(),
    paymentStatus: formData.get("paymentStatus")?.toString(),
  });
  if (!parsed.success) return { error: "Invalid status selected." };

  const before = await getOrderForAdmin(id);
  await updateOrderStatus(id, parsed.data);

  await writeAuditLog({
    adminUserId: admin.id,
    action: "update_status",
    entityType: "order",
    entityId: id,
    changes: {
      orderStatus: { from: before?.orderStatus, to: parsed.data.orderStatus },
      paymentStatus: { from: before?.paymentStatus, to: parsed.data.paymentStatus },
    },
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return { success: true };
}

export async function verifyOrderPaymentAction(orderPaymentDetailId: number, orderId: number) {
  const admin = await requireAdmin();
  const result = await verifyOrderPayment(orderPaymentDetailId, admin.id);

  if (result) {
    await writeAuditLog({
      adminUserId: admin.id,
      action: "verify_payment",
      entityType: "order",
      entityId: orderId,
      changes: { transactionId: result.detail.transactionId, paymentStatus: { to: "paid" } },
    });
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function sendOrderToSteadfastAction(orderId: number): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  const result = await sendOrderToSteadfast(orderId);

  if (result.success) {
    await writeAuditLog({
      adminUserId: admin.id,
      action: "send_to_courier",
      entityType: "order",
      entityId: orderId,
      changes: { courier: "steadfast", trackingCode: result.data.trackingCode },
    });
    revalidatePath(`/admin/orders/${orderId}`);
    return {};
  }

  return { error: result.error };
}

export async function refreshSteadfastStatusAction(orderId: number): Promise<{ error?: string }> {
  await requireAdmin();
  const result = await refreshSteadfastStatus(orderId);

  if (result.success) {
    revalidatePath(`/admin/orders/${orderId}`);
    return {};
  }

  return { error: result.error };
}
