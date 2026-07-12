import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { socialLinks } from "@/lib/db/schema";
import type { z } from "zod";
import type { socialLinkSchema } from "@/lib/validation/admin/social-link";

type SocialLinkInput = z.infer<typeof socialLinkSchema>;

export async function listSocialLinksForAdmin() {
  return db.query.socialLinks.findMany({ orderBy: asc(socialLinks.sortOrder) });
}

export async function getSocialLinkForAdmin(id: number) {
  return db.query.socialLinks.findFirst({ where: eq(socialLinks.id, id) });
}

function toRow(input: SocialLinkInput) {
  return {
    platform: input.platform,
    url: input.url,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? false,
  };
}

export async function createSocialLink(input: SocialLinkInput) {
  const [row] = await db.insert(socialLinks).values(toRow(input)).returning();
  return row;
}

export async function updateSocialLink(id: number, input: SocialLinkInput) {
  const [row] = await db.update(socialLinks).set(toRow(input)).where(eq(socialLinks.id, id)).returning();
  return row;
}

export async function deleteSocialLink(id: number) {
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
}
