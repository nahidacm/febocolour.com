import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, "Platform is required"),
  url: z.string().trim().url("Enter a valid URL"),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});
