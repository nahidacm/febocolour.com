import { sendMail } from "@/lib/email/client";
import { orderConfirmationEmail } from "@/lib/email/templates/order-confirmation";
import { adminNewOrderEmail } from "@/lib/email/templates/admin-new-order";
import type { OrderEmailPayload } from "@/lib/email/types";

export async function sendOrderConfirmationEmail(order: OrderEmailPayload) {
  if (!order.email) return; // Email is optional at checkout — nothing to send to.
  const { subject, html, text } = orderConfirmationEmail(order);
  await sendMail({ to: order.email, subject, html, text });
}

export async function sendAdminNewOrderEmail(order: OrderEmailPayload) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;
  const { subject, html, text } = adminNewOrderEmail(order);
  await sendMail({ to: adminEmail, subject, html, text });
}
