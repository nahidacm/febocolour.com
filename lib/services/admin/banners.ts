import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { homepageBanners } from "@/lib/db/schema";
import type { z } from "zod";
import type { bannerSchema } from "@/lib/validation/admin/banner";

type BannerInput = z.infer<typeof bannerSchema>;

export async function listBannersForAdmin() {
  return db.query.homepageBanners.findMany({ orderBy: asc(homepageBanners.sortOrder) });
}

export async function getBannerForAdmin(id: number) {
  return db.query.homepageBanners.findFirst({ where: eq(homepageBanners.id, id) });
}

function toRow(input: BannerInput) {
  return {
    title: input.title,
    subtitle: input.subtitle || null,
    ctaLabel: input.ctaLabel || null,
    ctaUrl: input.ctaUrl || null,
    secondaryCtaLabel: input.secondaryCtaLabel || null,
    secondaryCtaUrl: input.secondaryCtaUrl || null,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? false,
  };
}

export async function createBanner(input: BannerInput, imageKey: string) {
  const [row] = await db.insert(homepageBanners).values({ ...toRow(input), image: imageKey }).returning();
  return row;
}

export async function updateBanner(id: number, input: BannerInput, imageKey?: string) {
  const [row] = await db
    .update(homepageBanners)
    .set({ ...toRow(input), ...(imageKey ? { image: imageKey } : {}), updatedAt: new Date() })
    .where(eq(homepageBanners.id, id))
    .returning();
  return row;
}

export async function deleteBanner(id: number) {
  await db.delete(homepageBanners).where(eq(homepageBanners.id, id));
}
