import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  sku: z.string().trim().min(2, "SKU is required"),
  categoryId: z.string().optional(),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().optional(),
  specifications: z.string().trim().optional(),
  sizeChart: z.string().trim().optional(),
  regularPrice: z.coerce.number().positive("Must be greater than 0"),
  salePrice: z.union([z.literal(""), z.coerce.number().positive()]).optional(),
  stockQuantity: z.coerce.number().int().min(0),
  stockStatus: z.enum(["in_stock", "out_of_stock", "backorder"]),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
