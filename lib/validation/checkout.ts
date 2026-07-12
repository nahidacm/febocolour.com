import { z } from "zod";

// Cash on Delivery is the only payment method that doesn't need the customer to submit
// proof of payment up front — bKash/Nagad/Rocket/Bank Transfer all require it so the
// admin has something to verify against before marking the order paid.
const COD_CODE = "cod";

export const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required"),
    phone: z.string().trim().min(6, "A valid phone number is required"),
    email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional(),
    addressLine: z.string().trim().min(5, "Address is required"),
    city: z.string().trim().min(2, "City is required"),
    area: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    shippingMethodCode: z.string().min(1, "Please select a shipping method"),
    paymentMethodCode: z.string().min(1, "Please select a payment method"),
    senderNumber: z.string().trim().optional(),
    transactionId: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethodCode === COD_CODE) return;
    if (!data.senderNumber) {
      ctx.addIssue({
        code: "custom",
        path: ["senderNumber"],
        message: "Enter the number you sent payment from",
      });
    }
    if (!data.transactionId) {
      ctx.addIssue({ code: "custom", path: ["transactionId"], message: "Enter the transaction ID" });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
