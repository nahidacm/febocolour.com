import type { OrderEmailPayload } from "@/lib/email/types";
import { emailLayout, orderItemsTableHtml } from "@/lib/email/templates/layout";

export function adminNewOrderEmail(order: OrderEmailPayload) {
  const subject = `New Order ${order.orderNumber} — ৳${order.total.toLocaleString("en-US")}`;

  const bodyHtml = `
    <h1 style="font-size:20px;margin:0 0 8px;">New order received</h1>
    <p style="font-size:14px;color:#4a3f47;margin:0 0 16px;">
      <strong>${order.orderNumber}</strong> from <strong>${order.fullName}</strong> (${order.phone}${order.email ? `, ${order.email}` : ""})
    </p>
    ${orderItemsTableHtml(order.items)}
    <p style="font-size:14px;font-weight:bold;margin-top:16px;">Total: ৳${order.total.toLocaleString("en-US")}</p>
    <p style="font-size:14px;color:#4a3f47;margin-top:20px;">
      <strong>Shipping:</strong> ${order.shippingMethodName}<br/>
      <strong>Payment:</strong> ${order.paymentMethodName}<br/>
      <strong>Address:</strong> ${order.addressLine}, ${order.city}${order.area ? `, ${order.area}` : ""}
    </p>
  `;

  const text = `New order ${order.orderNumber} from ${order.fullName} (${order.phone}${order.email ? `, ${order.email}` : ""})\n\n${order.items
    .map((i) => `${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.quantity} — ৳${i.lineTotal}`)
    .join("\n")}\n\nTotal: ৳${order.total}\nShipping: ${order.shippingMethodName}\nPayment: ${order.paymentMethodName}\nAddress: ${order.addressLine}, ${order.city}${order.area ? `, ${order.area}` : ""}`;

  return { subject, html: emailLayout({ title: subject, bodyHtml }), text };
}
