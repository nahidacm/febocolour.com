import { z } from "zod";

export const shippingMethodSchema = z.object({
  code: z.string().trim().min(1, "Code is required").regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores"),
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional(),
  rateType: z.enum(["flat", "free", "manual"]),
  flatRate: z.union([z.literal(""), z.coerce.number().min(0)]).optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});
