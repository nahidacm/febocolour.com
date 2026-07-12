import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  subtitle: z.string().trim().optional(),
  ctaLabel: z.string().trim().optional(),
  ctaUrl: z.string().trim().optional(),
  secondaryCtaLabel: z.string().trim().optional(),
  secondaryCtaUrl: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
});
