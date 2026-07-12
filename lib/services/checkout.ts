import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  cartItems,
  orderItems,
  orderPaymentDetails,
  orders,
  paymentMethodConfigs,
  shippingMethodConfigs,
} from "@/lib/db/schema";
import { getCartSummary } from "@/lib/services/cart";
import type { CheckoutInput } from "@/lib/validation/checkout";
import { sendAdminNewOrderEmail, sendOrderConfirmationEmail } from "@/lib/email/send";

export type PlaceOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

export async function placeOrder(
  tokenHash: string | undefined,
  input: CheckoutInput,
  customerId?: number,
): Promise<PlaceOrderResult> {
  const cart = await getCartSummary(tokenHash);
  if (cart.items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const shippingMethod = await db.query.shippingMethodConfigs.findFirst({
    where: and(
      eq(shippingMethodConfigs.code, input.shippingMethodCode),
      eq(shippingMethodConfigs.isActive, true),
    ),
  });
  if (!shippingMethod) {
    return { success: false, error: "Please select a valid shipping method." };
  }

  const paymentMethod = await db.query.paymentMethodConfigs.findFirst({
    where: and(
      eq(paymentMethodConfigs.code, input.paymentMethodCode),
      eq(paymentMethodConfigs.isActive, true),
    ),
  });
  if (!paymentMethod) {
    return { success: false, error: "Please select a valid payment method." };
  }

  for (const item of cart.items) {
    if (item.stockStatus === "out_of_stock" || item.stockAvailable < item.quantity) {
      return {
        success: false,
        error: `"${item.productName}" no longer has enough stock. Please update your cart.`,
      };
    }
  }

  const shippingCost = shippingMethod.rateType === "free" ? 0 : Number(shippingMethod.flatRate ?? 0);
  const subtotal = cart.subtotal;
  const total = subtotal + shippingCost;

  const placed = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(orders)
      .values({
        // Never committed as-is — replaced with the real FC-###### number below in the
        // same transaction. Just needs to satisfy the NOT NULL + UNIQUE constraint.
        orderNumber: randomUUID(),
        customerId: customerId ?? null,
        shippingFullName: input.fullName,
        shippingPhone: input.phone,
        email: input.email || null,
        shippingAddressLine: input.addressLine,
        shippingCity: input.city,
        shippingArea: input.area || null,
        shippingPostalCode: input.postalCode || null,
        notes: input.notes || null,
        shippingMethodId: shippingMethod.id,
        shippingCost: shippingCost.toFixed(2),
        paymentMethodId: paymentMethod.id,
        subtotal: subtotal.toFixed(2),
        total: total.toFixed(2),
      })
      .returning({ id: orders.id });

    const orderNumber = `FC-${String(inserted.id).padStart(6, "0")}`;
    await tx.update(orders).set({ orderNumber }).where(eq(orders.id, inserted.id));

    await tx.insert(orderItems).values(
      cart.items.map((item) => ({
        orderId: inserted.id,
        productId: item.productId,
        variantId: item.variantId,
        productNameSnapshot: item.productName,
        variantLabelSnapshot: item.variantLabel,
        skuSnapshot: item.sku,
        unitPrice: item.unitPrice.toFixed(2),
        quantity: item.quantity,
        lineTotal: item.lineTotal.toFixed(2),
      })),
    );

    await tx.insert(orderPaymentDetails).values({
      orderId: inserted.id,
      paymentMethodCode: paymentMethod.code,
      amount: total.toFixed(2),
    });

    for (const item of cart.items) {
      if (item.variantId) {
        await tx.execute(sql`
          UPDATE product_variants
          SET stock_quantity = GREATEST(stock_quantity - ${item.quantity}, 0),
              stock_status = CASE WHEN stock_quantity - ${item.quantity} <= 0 THEN 'out_of_stock'::stock_status ELSE stock_status END,
              updated_at = now()
          WHERE id = ${item.variantId}
        `);
      } else {
        await tx.execute(sql`
          UPDATE products
          SET stock_quantity = GREATEST(stock_quantity - ${item.quantity}, 0),
              stock_status = CASE WHEN stock_quantity - ${item.quantity} <= 0 THEN 'out_of_stock'::stock_status ELSE stock_status END,
              updated_at = now()
          WHERE id = ${item.productId}
        `);
      }
    }

    if (cart.cartId) {
      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.cartId));
    }

    return { id: inserted.id, orderNumber };
  });

  const emailPayload = {
    orderNumber: placed.orderNumber,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email || undefined,
    addressLine: input.addressLine,
    city: input.city,
    area: input.area,
    shippingMethodName: shippingMethod.name,
    paymentMethodName: paymentMethod.name,
    items: cart.items.map((item) => ({
      name: item.productName,
      variantLabel: item.variantLabel,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
    subtotal,
    shippingCost,
    total,
  };

  // Never let email delivery failures affect the order outcome.
  sendOrderConfirmationEmail(emailPayload).catch((err: unknown) =>
    console.error("Failed to send order confirmation email", err),
  );
  sendAdminNewOrderEmail(emailPayload).catch((err: unknown) =>
    console.error("Failed to send admin new-order email", err),
  );

  return { success: true, orderNumber: placed.orderNumber };
}
