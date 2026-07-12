import type { MetadataRoute } from "next";
import { db } from "@/lib/db/client";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// A fixed reference date for pages with no real "last edited" timestamp to track
// (their content is defined in code, not the DB). Using `new Date()` here would tell
// crawlers every static page changes on every single crawl, which defeats the purpose
// of lastmod — update this constant only when you actually edit one of these pages.
const STATIC_CONTENT_DATE = new Date("2026-07-12");

const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/shipping-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/return-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [activeCategories, activeProducts] = await Promise.all([
    db.query.categories.findMany({
      where: eq(categories.isActive, true),
      columns: { slug: true, updatedAt: true },
    }),
    db.query.products.findMany({
      where: eq(products.isActive, true),
      columns: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: STATIC_CONTENT_DATE,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...activeCategories.map((category) => ({
      url: `${siteUrl}/category/${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...activeProducts.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
