"use server";

import { redirect } from "next/navigation";
import { checkoutSchema } from "@/lib/validation/checkout";
import { placeOrder } from "@/lib/services/checkout";
import { readCartTokenHash } from "@/lib/cart/session";

export type CheckoutFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function placeOrderAction(
  _prevState: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const raw = {
    fullName: formData.get("fullName")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    addressLine: formData.get("addressLine")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    area: formData.get("area")?.toString() ?? "",
    postalCode: formData.get("postalCode")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
    shippingMethodCode: formData.get("shippingMethodCode")?.toString() ?? "",
    paymentMethodCode: formData.get("paymentMethodCode")?.toString() ?? "",
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString();
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the errors below.", fieldErrors };
  }

  const tokenHash = await readCartTokenHash();
  const result = await placeOrder(tokenHash, parsed.data);

  if (!result.success) {
    return { error: result.error };
  }

  redirect(`/checkout/confirmation/${result.orderNumber}`);
}
