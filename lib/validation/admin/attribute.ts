import { z } from "zod";

export const attributeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  inputType: z.enum(["select", "color_swatch"]),
});

export type AttributeInput = z.infer<typeof attributeSchema>;

export const attributeValueSchema = z.object({
  id: z.number().optional(),
  value: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  swatchHex: z.string().trim().optional().nullable(),
});

export type AttributeValueInput = z.infer<typeof attributeValueSchema>;
