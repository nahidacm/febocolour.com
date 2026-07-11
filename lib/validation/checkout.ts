import { z } from "zod";

export const checkoutSchema = z.object({
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
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
