import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  parentId: z.string().optional(),
  description: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().optional(),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
