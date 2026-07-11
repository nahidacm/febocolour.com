import { z } from "zod";

export const orderStatusUpdateSchema = z.object({
  orderStatus: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "returned"]),
  paymentStatus: z.enum(["pending", "awaiting_verification", "paid", "failed", "refunded"]),
});
