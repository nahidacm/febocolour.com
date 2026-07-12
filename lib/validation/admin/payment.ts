import { z } from "zod";

export const paymentMethodSchema = z.object({
  code: z.string().trim().min(1, "Code is required").regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores"),
  name: z.string().trim().min(1, "Name is required"),
  instructions: z.string().trim().optional(),
  accountDetails: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().optional(),
  requiresManualVerification: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
});
