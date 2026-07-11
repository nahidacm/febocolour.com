import type { OrderEmailPayload } from "@/lib/email/types";
import { emailLayout, orderItemsTableHtml } from "@/lib/email/templates/layout";

export function orderConfirmationEmail(order: OrderEmailPayload) {
  const subject = `Order Confirmed — ${order.orderNumber}`;

  const bodyHtml = `
    <h1 style="font-size:20px;margin:0 0 8px;">Thank you, ${order.fullName}!</h1>
    <p style="font-size:14px;color:#4a3f47;margin:0 0 16px;">
      We've received your order <strong>${order.orderNumber}</strong> and we're getting it ready.
    </p>
    ${orderItemsTableHtml(order.items)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:14px;">
      <tr><td style="color:#7c737a;">Subtotal</td><td style="text-align:right;">৳${order.subtotal.toLocaleString("en-US")}</td></tr>
      <tr><td style="color:#7c737a;">Shipping (${order.shippingMethodName})</td><td style="text-align:right;">৳${order.shippingCost.toLocaleString("en-US")}</td></tr>
      <tr><td style="padding-top:6px;font-weight:bold;">Total</td><td style="padding-top:6px;text-align:right;font-weight:bold;">৳${order.total.toLocaleString("en-US")}</td></tr>
    </table>
    <p style="font-size:14px;color:#4a3f47;margin-top:20px;">
      <strong>Payment method:</strong> ${order.paymentMethodName}<br/>
      <strong>Delivering to:</strong> ${order.addressLine}, ${order.city}${order.area ? `, ${order.area}` : ""}<br/>
      <strong>Phone:</strong> ${order.phone}
    </p>
    <p style="font-size:14px;color:#4a3f47;margin-top:20px;">
      Questions about your order? Message us on WhatsApp or Facebook — we're happy to help.
    </p>
  `;

  const text = `Thank you, ${order.fullName}!\n\nWe've received your order ${order.orderNumber}.\n\n${order.items
    .map((i) => `${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.quantity} — ৳${i.lineTotal}`)
    .join("\n")}\n\nSubtotal: ৳${order.subtotal}\nShipping (${order.shippingMethodName}): ৳${order.shippingCost}\nTotal: ৳${order.total}\n\nPayment method: ${order.paymentMethodName}\nDelivering to: ${order.addressLine}, ${order.city}${order.area ? `, ${order.area}` : ""}\nPhone: ${order.phone}`;

  return { subject, html: emailLayout({ title: subject, bodyHtml }), text };
}
